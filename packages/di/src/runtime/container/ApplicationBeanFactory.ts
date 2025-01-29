import { ApplicationConfigurationFactory } from './ApplicationConfigurationFactory';
import { ApplicationBean } from './ApplicationBean';
import { BeanIdProvider } from './BeanIdProvider';
import { BeanConstructorFactory } from '../api/decorators/index';
import { ObjectFactoryImpl } from '../ObjectFactoryImpl';
import { MetadataStorage } from '../MetadataStorage';
import { ClassConstructor } from '../api/ClassConstructor';
import { ApplicationBeanDependency } from './ApplicationBeanDependency';
import { ApplicationBeanFinder } from './ApplicationBeanFinder';
import { MaybePromise } from '../types/MaybePromise';
import { Utils } from '../Utils';
import { RuntimeErrors } from '../api/RuntimeErrors';
import { Scope } from '../api/Scope';
import { InternalScopeRegister } from '../scope/InternalScopeRegister';

import { BeanProcessor } from '../api/BeanProcessor';
import { RuntimeApplicationMetadata } from '@clawject/core/runtime-metadata/RuntimeApplicationMetadata';
import { BeanKind } from '@clawject/core/core/bean/BeanKind';

export class ApplicationBeanFactory {
  exposedBeanNameToApplicationBeanDependency = new Map<string, ApplicationBeanDependency>();
  applicationBeans: ApplicationBean[] = [];
  configurationIdToBeanClassPropertyToApplicationBean = new Map<number, Map<string, ApplicationBean>>();
  scopeToScopedApplicationBeans = new Map<Scope, ApplicationBean[]>();
  applicationBeanFinder: ApplicationBeanFinder;

  constructor(
    private readonly applicationConfigurationFactory: ApplicationConfigurationFactory,
    public readonly beanProcessors: BeanProcessor[],
    public readonly scopeRegister: InternalScopeRegister,
  ) {
    this.applicationBeanFinder = new ApplicationBeanFinder(
      this.configurationIdToBeanClassPropertyToApplicationBean,
      applicationConfigurationFactory
    );
  }

  async init(applicationMetadata: RuntimeApplicationMetadata): Promise<void> {
    await this.createApplicationBeans(applicationMetadata);
    this.fillExposedBeans(applicationMetadata);
    await this.initBeans();
  }

  async postInit(): Promise<void> {
    const singletonScope = this.scopeRegister.getScope('singleton');
    await this.initScopedBeans(singletonScope);

    const lifecycleInit = this.applicationBeans.map(async (applicationBean) => {
      if (applicationBean.isLifecycleFunction) {
        if (applicationBean.parentConfiguration.metadata.lifecycle.POST_CONSTRUCT.includes(applicationBean.beanClassProperty)) {
          await applicationBean.getInjectionValue();
        }
      }
    });

    await Promise.all(lifecycleInit);
  }

  async destroy(): Promise<void> {
    await Promise.all(this.applicationBeans.map(async (applicationBean) => {
      if (applicationBean.isLifecycleFunction) {
        if (applicationBean.parentConfiguration.metadata.lifecycle.PRE_DESTROY.includes(applicationBean.beanClassProperty)) {
          await applicationBean.getInjectionValue();
        }
      }
    }));

    await Promise.all(this.applicationBeans.map(async bean => {
      if (bean.isLifecycleFunction) {
        return;
      }

      const beanScope = bean.getScope();
      const removedScopedObject = beanScope.remove(bean.name);

      if (removedScopedObject === null) {
        return;
      }

      //TODO: check warning
      await this.onLifecycle(await removedScopedObject, 'POST_CONSTRUCT');
    }));
  }

  async getExposedBean(beanName: string): Promise<any> {
    const exposedBeans = Utils.getValueSafe(this.exposedBeanNameToApplicationBeanDependency, beanName);

    if (exposedBeans === Utils.EMPTY_VALUE) {
      throw new RuntimeErrors.ExposedBeanNotFoundError(`No exposed bean found by exposed name: ${beanName}`);
    }

    const value = await exposedBeans.getValue();

    return value.value;
  }

  async getExposedBeans(): Promise<Record<string, any>> {
    const data = Promise.all(
      Array.from(this.exposedBeanNameToApplicationBeanDependency.entries())
        .map(async ([beanName, exposedBeans]) =>
          [beanName, (await exposedBeans.getValue()).value],
        ),
    );

    return Object.fromEntries(await data);
  }

  private async createApplicationBeans(applicationMetadata: RuntimeApplicationMetadata): Promise<void> {
    const resultPromise = this.applicationConfigurationFactory.mapConfigurations(async (applicationConfiguration) => {
      const beanDependenciesMetadataByConfiguration = applicationMetadata.beanDependenciesMetadata[applicationConfiguration.index];

      if (!beanDependenciesMetadataByConfiguration) {
        throw new RuntimeErrors.IllegalUsageError('No bean dependencies metadata found');
      }

      const beanClassPropertyToApplicationBean = new Map<string, ApplicationBean>();
      this.configurationIdToBeanClassPropertyToApplicationBean.set(applicationConfiguration.id, beanClassPropertyToApplicationBean);

      const beanNameToDependenciesMetadata = new Map<string, ApplicationBeanDependency[]>(Object.values(
        beanDependenciesMetadataByConfiguration.map(it => {
          const applicationBeanDependencies = it.dependencies
            .map(it => new ApplicationBeanDependency(it, this.applicationBeanFinder));

          return [it.classPropertyName, applicationBeanDependencies];
        }),
      ));

      const initPromises = Object.entries(applicationConfiguration.metadata.beans).map(async ([beanClassProperty, beanMetadata]) => {
        const beanDependenciesMetadata = beanNameToDependenciesMetadata.get(beanClassProperty) ?? null;
        let beanClassConstructor: ClassConstructor<any> | null = null;

        if (beanMetadata.kind === BeanKind.CLASS_CONSTRUCTOR) {
          const classProperty = applicationConfiguration.instance[beanClassProperty] as MaybePromise<BeanConstructorFactory<any, any>>;

          if (Utils.isPromise(classProperty)) {
            const resolvedClassProperty = await classProperty;
            beanClassConstructor = resolvedClassProperty.constructor;
          } else {
            beanClassConstructor = classProperty.constructor;
          }
        }

        const applicationBean = new ApplicationBean(
          BeanIdProvider.getAndInc(),
          applicationConfiguration,
          beanClassProperty,
          beanMetadata,
          beanDependenciesMetadata,
          beanClassConstructor,
          this.scopeRegister,
        );
        beanClassPropertyToApplicationBean.set(beanClassProperty, applicationBean);
        this.applicationBeans.push(applicationBean);

        if (!applicationBean.isLifecycleFunction) {
          const scope = applicationBean.getScope();
          const scopedBeans = this.scopeToScopedApplicationBeans.get(scope) ?? [];

          if (!this.scopeToScopedApplicationBeans.has(scope)) {
            this.scopeToScopedApplicationBeans.set(scope, scopedBeans);
          }

          scopedBeans.push(applicationBean);
        }
      });

      await Promise.all(initPromises);
    });

    await Promise.all(resultPromise);
  }

  async initScopedBeans(scope: Scope): Promise<void> {
    const scopedBeans = this.scopeToScopedApplicationBeans.get(scope) ?? [];

    await Promise.all(scopedBeans.map(async it => {
      if (it.isLifecycleFunction || it.lazy) {
        return;
      }

      return it.getScopedBeanValue();
    }));
  }

  private fillExposedBeans(applicationMetadata: RuntimeApplicationMetadata): void {
    applicationMetadata.exposedBeansMetadata.forEach((exposedBeanMetadata) => {
      this.exposedBeanNameToApplicationBeanDependency.set(exposedBeanMetadata.qualifiedName, new ApplicationBeanDependency(exposedBeanMetadata.metadata, this.applicationBeanFinder));
    });
  }

  private async initBeans(): Promise<void> {
    await Promise.all(this.applicationBeans.map(async (applicationBean) => {
      const rawFactory = await this.getBeanFactoryFunction(applicationBean);
      let processedFactory = rawFactory;

      if (!applicationBean.isLifecycleFunction) {
        processedFactory = this.beanProcessors.reduce((acc, processor) => {
          if (processor.processFactory) {
            return processor.processFactory({
              beanMetadata: applicationBean.toMetadata(),
              factory: acc,
            });
          }

          return acc;
        }, rawFactory);
      }

      const objectFactory = new ObjectFactoryImpl(() => {
        return this.createBeanInstance(applicationBean, processedFactory);
      });

      applicationBean.init(objectFactory);
    }));

    this.beanProcessors.forEach(processor => processor.onBeansInitialized?.());
  }

  private async createBeanInstance(applicationBean: ApplicationBean, factory: (...args: unknown[]) => any): Promise<any> {
    const dependencyInjectionPromises = applicationBean.dependencies?.map(it => {
      return it.getValue();
    });
    const dependencyInjectionValues = await Promise.all(dependencyInjectionPromises ?? []);
    const result = await factory(...dependencyInjectionValues.map(it => it.value));

    this.registerDestructionCallbackIfNeeded(applicationBean, result);
    await this.onLifecycle(result, 'POST_CONSTRUCT');

    return result;
  }

  // @ts-ignore
  private getBeanFactoryFunction(applicationBean: ApplicationBean): MaybePromise<(...args: unknown[]) => any> {
    const configurationInstance = applicationBean.parentConfiguration.instance;

    switch (applicationBean.beanMetadata.kind) {
    case BeanKind.FACTORY_METHOD:
    case BeanKind.LIFECYCLE_METHOD:
      return configurationInstance[applicationBean.beanClassProperty].bind(configurationInstance);
    case BeanKind.CLASS_CONSTRUCTOR: {
      const classPropertyValue = configurationInstance[applicationBean.beanClassProperty] as MaybePromise<BeanConstructorFactory<any, any>>;

      if (Utils.isPromise(classPropertyValue)) {
        return classPropertyValue.then(it => it.factory);
      }

      return classPropertyValue.factory;
    }
    case BeanKind.FACTORY_ARROW_FUNCTION:
    case BeanKind.LIFECYCLE_ARROW_FUNCTION:
      return configurationInstance[applicationBean.beanClassProperty];
    case BeanKind.VALUE_EXPRESSION:
      return () => configurationInstance[applicationBean.beanClassProperty];
    }
  }

  private registerDestructionCallbackIfNeeded(applicationBean: ApplicationBean, instance: any): void {
    if (applicationBean.isLifecycleFunction) {
      return;
    }

    const componentMetadata = MetadataStorage.getComponentMetadataByClassInstance(instance);
    const hasLifecyclePreDestroy = componentMetadata !== null && componentMetadata.lifecycle.PRE_DESTROY.length > 0;

    if (hasLifecyclePreDestroy) {
      applicationBean.getScope().registerDestructionCallback(applicationBean.name, async () => {
        await this.onLifecycle(instance, 'PRE_DESTROY');
      });
    }
  }

  private async onLifecycle(beanInstance: any, lifecycleKind: 'POST_CONSTRUCT' | 'PRE_DESTROY'): Promise<void> {
    await Promise.all(
      MetadataStorage.getComponentMetadataByClassInstance(beanInstance)?.lifecycle[lifecycleKind].map(async methodName => {
        await (beanInstance[methodName] as Function).call(beanInstance);
      }) ?? [],
    );
  }
}
