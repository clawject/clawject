import { ApplicationConfigurationFactory } from './ApplicationConfigurationFactory';
import { RuntimeApplicationMetadata } from '../metadata/RuntimeApplicationMetadata';
import { ApplicationBean } from './ApplicationBean';
import { BeanIdProvider } from './BeanIdProvider';
import { BeanKind } from '../../compile-time/core/bean/BeanKind';
import { BeanConstructorFactory } from '../decorators/index';
import { ObjectFactoryImpl } from '../object-factory/ObjectFactoryImpl';
import { LifecycleKind } from '../LifecycleKind';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { ClassConstructor } from '../ClassConstructor';
import { ApplicationBeanDependency } from './ApplicationBeanDependency';
import { ApplicationBeanFinder } from './ApplicationBeanFinder';
import { MaybeAsync } from './MaybeAsync';
import { isPromise } from './isPromise';

export class ApplicationBeanFactory {
  applicationBeans: ApplicationBean[] = [];
  configurationIndexToBeanClassPropertyToApplicationBean = new Map<number, Map<string, ApplicationBean>>();
  applicationBeanFinder = new ApplicationBeanFinder(this.configurationIndexToBeanClassPropertyToApplicationBean);

  constructor(
    private readonly applicationConfigurationFactory: ApplicationConfigurationFactory,
  ) {}

  async init(applicationMetadata: RuntimeApplicationMetadata): Promise<void> {
    await this.createApplicationBeans(applicationMetadata);
    await this.initBeans();
  }

  async postInit(): Promise<void> {
    const lifecycleBeans: ApplicationBean[] = [];

    const regular = this.applicationBeans.map(async(applicationBean) => {
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

  destroy(): void {
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

  private async createApplicationBeans(applicationMetadata: RuntimeApplicationMetadata): Promise<void> {
    const resultPromise = this.applicationConfigurationFactory.mapConfigurations(async (applicationConfiguration) => {
      const beanDependenciesMetadataByConfiguration = applicationMetadata.beanDependenciesMetadata[applicationConfiguration.index];

      if (!beanDependenciesMetadataByConfiguration) {
        //TODO runtime error
        throw new Error('No bean dependencies metadata found');
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

          if (isPromise(classProperty)) {
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

  private async initBeans(): Promise<void> {
    await Promise.all(this.applicationBeans.map((applicationBean) => {
      const factory = this.getBeanFactoryFunction(applicationBean);

      const objectFactory = new ObjectFactoryImpl(() => {
        const dependencies = applicationBean.dependencies?.map(it => it.getValue()) ?? [];

        let instantiatedBean: any;

        if (dependencies.some(isPromise)) {
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

  private getBeanFactoryFunction(applicationBean: ApplicationBean): (...args: any[]) => any {
    const configurationInstance = applicationBean.parentConfiguration.instance;

    switch (applicationBean.beanMetadata.kind) {
    case BeanKind.FACTORY_METHOD:
    case BeanKind.LIFECYCLE_METHOD:
      return configurationInstance[applicationBean.beanClassProperty].bind(configurationInstance);
    case BeanKind.CLASS_CONSTRUCTOR:
      return (configurationInstance[applicationBean.beanClassProperty] as BeanConstructorFactory<any, any>).factory;
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
