import { ApplicationConfigurationFactory } from './ApplicationConfigurationFactory';
import { RuntimeApplicationMetadata } from '../metadata/RuntimeApplicationMetadata';
import { ApplicationBean } from './ApplicationBean';
import { BeanIdProvider } from './BeanIdProvider';
import { BeanKind } from '../../compile-time/core/bean/BeanKind';
import { BeanConstructorFactory } from '../api/decorators/index';
import { ObjectFactoryImpl } from '../ObjectFactoryImpl';
import { LifecycleKind } from '../types/LifecycleKind';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { ClassConstructor } from '../api/ClassConstructor';
import { ApplicationBeanDependency } from './ApplicationBeanDependency';
import { ApplicationBeanFinder } from './ApplicationBeanFinder';
import { MaybeAsync } from '../types/MaybeAsync';
import { Utils } from '../Utils';
import { RuntimeErrors } from '../api/RuntimeErrors';

export class ApplicationBeanFactory {
  exportedBeanNameToApplicationBeanDependency = new Map<string, ApplicationBeanDependency>();
  applicationBeans: ApplicationBean[] = [];
  configurationIndexToBeanClassPropertyToApplicationBean = new Map<number, Map<string, ApplicationBean>>();
  applicationBeanFinder = new ApplicationBeanFinder(this.configurationIndexToBeanClassPropertyToApplicationBean);

  constructor(
    private readonly applicationConfigurationFactory: ApplicationConfigurationFactory,
  ) {
  }

  async init(applicationMetadata: RuntimeApplicationMetadata): Promise<void> {
    await this.createApplicationBeans(applicationMetadata);
    this.fillExportedBeans(applicationMetadata);
    await this.initBeans();
  }

  async postInit(): Promise<void> {
    const lifecycleBeans: ApplicationBean[] = [];

    const regular = this.applicationBeans.map(async (applicationBean) => {
      if (applicationBean.isLifecycleFunction) {
        lifecycleBeans.push(applicationBean);
        return;
      }

      if (applicationBean.scopeName === 'singleton' && !applicationBean.lazy) {
        await applicationBean.getValue();
      }
    });

    const lifecycle = lifecycleBeans.map(async (applicationBean) => {
      if (applicationBean.parentConfiguration.metadata.lifecycle[LifecycleKind.POST_CONSTRUCT].includes(applicationBean.beanClassProperty)) {
        await applicationBean.objectFactory.getObject();
      }
    });

    await Promise.all([...regular, ...lifecycle]);
  }

  close(): void {
    const lifecycleBeans = new Set<ApplicationBean>();

    this.applicationBeans.forEach((applicationBean) => {
      if (applicationBean.isLifecycleFunction) {
        lifecycleBeans.add(applicationBean);
        return;
      }

      const scopedObject = applicationBean.getScope().remove(applicationBean.name);

      this.onLifecycle(scopedObject, LifecycleKind.PRE_DESTROY);
    });

    lifecycleBeans.forEach((applicationBean) => {
      if (applicationBean.parentConfiguration.metadata.lifecycle[LifecycleKind.PRE_DESTROY].includes(applicationBean.beanClassProperty)) {
        applicationBean.objectFactory.getObject();
      }
    });
  }

  getExposedBean(beanName: string): Promise<any> {
    const exportedBean = Utils.getValueSafe(this.exportedBeanNameToApplicationBeanDependency, beanName);

    if (exportedBean === Utils.EMPTY_VALUE) {
      throw new RuntimeErrors.BeanNotFoundError(`No exported bean found by exported name: ${beanName}`);
    }

    return exportedBean.getValue();
  }

  async getExposedBeans(): Promise<Record<string, any>> {
    const data = Promise.all(
      Array.from(this.exportedBeanNameToApplicationBeanDependency.entries()).map(async ([beanName, exportedBean]) => [beanName, await exportedBean.getValue()] as const),
    );

    return Object.fromEntries(await data);
  }

  private async createApplicationBeans(applicationMetadata: RuntimeApplicationMetadata): Promise<void> {
    const resultPromise = this.applicationConfigurationFactory.mapConfigurations(async (applicationConfiguration) => {
      const beanDependenciesMetadataByConfiguration = applicationMetadata.beanDependenciesMetadata[applicationConfiguration.index];

      if (!beanDependenciesMetadataByConfiguration) {
        throw new RuntimeErrors.CorruptedMetadataError('No bean dependencies metadata found');
      }

      const configurationIndexToBeanClassPropertyToApplicationBean = new Map<string, ApplicationBean>();
      this.configurationIndexToBeanClassPropertyToApplicationBean.set(applicationConfiguration.index, configurationIndexToBeanClassPropertyToApplicationBean);

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
          const classProperty = applicationConfiguration.instance[beanClassProperty] as MaybeAsync<BeanConstructorFactory<any, any>>;

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
        );
        configurationIndexToBeanClassPropertyToApplicationBean.set(beanClassProperty, applicationBean);
        this.applicationBeans.push(applicationBean);
      });

      await Promise.all(initPromises);
    });

    await Promise.all(resultPromise);
  }

  private fillExportedBeans(applicationMetadata: RuntimeApplicationMetadata): void {
    applicationMetadata.exposedBeansMetadata.forEach((exportedBeanMetadata) => {
      this.exportedBeanNameToApplicationBeanDependency.set(exportedBeanMetadata.qualifiedName, new ApplicationBeanDependency(exportedBeanMetadata.metadata, this.applicationBeanFinder));
    });
  }

  private async initBeans(): Promise<void> {
    await Promise.all(this.applicationBeans.map(async (applicationBean) => {
      const factory = await this.getBeanFactoryFunction(applicationBean);

      const objectFactory = new ObjectFactoryImpl(() => {
        const dependencies = applicationBean.dependencies?.map(it => it.getValue()) ?? [];

        let instantiatedBean: any;

        if (dependencies.some(Utils.isPromise)) {
          instantiatedBean = Promise.all(dependencies).then((resolvedDependencies) => {
            return factory(...resolvedDependencies);
          });
        } else {
          instantiatedBean = factory(...dependencies);
        }

        if (!applicationBean.isLifecycleFunction) {
          this.registerDestructionCallback(applicationBean, instantiatedBean);
        }

        this.onLifecycle(instantiatedBean, LifecycleKind.POST_CONSTRUCT);

        return instantiatedBean;
      });

      applicationBean.init(objectFactory);
    }));
  }

  private getBeanFactoryFunction(applicationBean: ApplicationBean): MaybeAsync<(...args: any[]) => any> {
    const configurationInstance = applicationBean.parentConfiguration.instance;

    switch (applicationBean.beanMetadata.kind) {
    case BeanKind.FACTORY_METHOD:
    case BeanKind.LIFECYCLE_METHOD:
      return configurationInstance[applicationBean.beanClassProperty].bind(configurationInstance);
    case BeanKind.CLASS_CONSTRUCTOR: {
      const classPropertyValue = configurationInstance[applicationBean.beanClassProperty] as MaybeAsync<BeanConstructorFactory<any, any>>;

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

  private registerDestructionCallback(applicationBean: ApplicationBean, instance: any): void {
    const componentMetadata = MetadataStorage.getComponentMetadataByClassInstance(instance);
    const hasLifecyclePreDestroy = componentMetadata !== null && componentMetadata.lifecycle.PRE_DESTROY.length > 0;

    if (hasLifecyclePreDestroy) {
      applicationBean.getScope().registerDestructionCallback(applicationBean.name, () => this.onLifecycle(instance, LifecycleKind.PRE_DESTROY));
    }
  }

  private onLifecycle(beanInstance: any, lifecycleKind: LifecycleKind): void {
    MetadataStorage.getComponentMetadataByClassInstance(beanInstance)?.lifecycle[lifecycleKind].forEach(methodName => {
      beanInstance[methodName]();
    });
  }
}
