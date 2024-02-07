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

export class ApplicationBeanFactory {
  applicationBeans = new Set<ApplicationBean>();
  configurationIndexToBeanClassPropertyToApplicationBean = new Map<number, Map<string, ApplicationBean>>();
  applicationBeanFinder = new ApplicationBeanFinder(this.configurationIndexToBeanClassPropertyToApplicationBean);

  constructor(
    private readonly applicationConfigurationFactory: ApplicationConfigurationFactory,
  ) {}

  init(applicationMetadata: RuntimeApplicationMetadata): void {
    this.createApplicationBeans(applicationMetadata);
    this.initBeans();
  }

  postInit(): void {
    const lifecycleBeans = new Set<ApplicationBean>();

    this.applicationBeans.forEach((applicationBean) => {
      if (applicationBean.isLifecycleFunction) {
        lifecycleBeans.add(applicationBean);
        return;
      }

      if (applicationBean.scopeName === 'singleton' && !applicationBean.lazy) {
        applicationBean.getValue();
      }
    });

    lifecycleBeans.forEach((applicationBean) => {
      if (applicationBean.parentConfigurationMetadata.lifecycle[LifecycleKind.POST_CONSTRUCT].includes(applicationBean.beanClassProperty)) {
        applicationBean.objectFactory.getObject();
      }
    });
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
      if (applicationBean.parentConfigurationMetadata.lifecycle[LifecycleKind.PRE_DESTROY].includes(applicationBean.beanClassProperty)) {
        applicationBean.objectFactory.getObject();
      }
    });
  }

  private createApplicationBeans(applicationMetadata: RuntimeApplicationMetadata): void {
    this.applicationConfigurationFactory.forEachConfiguration((instance, metadata, configurationIndex) => {
      const beanDependenciesMetadataByConfiguration = applicationMetadata.beanDependenciesMetadata[configurationIndex];

      if (!beanDependenciesMetadataByConfiguration) {
        //TODO runtime error
        throw new Error('No bean dependencies metadata found');
      }

      const configurationIndexToBeanClassPropertyToApplicationBean = new Map<string, ApplicationBean>();
      this.configurationIndexToBeanClassPropertyToApplicationBean.set(configurationIndex, configurationIndexToBeanClassPropertyToApplicationBean);

      const beanNameToDependenciesMetadata = new Map<string, ApplicationBeanDependency[]>(Object.values(
        beanDependenciesMetadataByConfiguration.map(it => {
          const applicationBeanDependencies = it.dependencies
            .map(it => new ApplicationBeanDependency(it, this.applicationBeanFinder));

          return [it.classPropertyName, applicationBeanDependencies];
        }),
      ));

      Object.keys(metadata.beans).forEach((beanClassProperty) => {
        const beanMetadata = metadata.beans[beanClassProperty];
        if (!beanMetadata) {
          //TODO runtime error
          throw new Error('No bean metadata found');
        }

        const beanDependenciesMetadata = beanNameToDependenciesMetadata.get(beanClassProperty) ?? null;
        const configurationInstance = this.applicationConfigurationFactory.getConfigurationInstanceByIndexUnsafe(configurationIndex);
        let beanClassConstructor: ClassConstructor<any> | null = null;

        if (beanMetadata.kind === BeanKind.CLASS_CONSTRUCTOR) {
          beanClassConstructor = (configurationInstance[beanClassProperty] as BeanConstructorFactory<any, any>).constructor;
        }

        const applicationBean = new ApplicationBean(
          BeanIdProvider.getAndInc(),
          configurationIndex,
          beanClassProperty,
          beanMetadata,
          metadata,
          beanDependenciesMetadata,
          beanClassConstructor,
        );
        configurationIndexToBeanClassPropertyToApplicationBean.set(beanClassProperty, applicationBean);
        this.applicationBeans.add(applicationBean);
      });
    });
  }

  private initBeans(): void {
    this.applicationBeans.forEach((applicationBean) => {
      const factory = this.getBeanFactoryFunction(applicationBean);

      const objectFactory = new ObjectFactoryImpl(() => {
        const dependencies = applicationBean.dependencies?.map(it => it.getValue()) ?? [];
        const instantiatedBean = factory(...dependencies);

        if (!applicationBean.isLifecycleFunction) {
          this.registerDestructionCallback(applicationBean, instantiatedBean);
        }

        this.onLifecycle(instantiatedBean, LifecycleKind.POST_CONSTRUCT);

        return instantiatedBean;
      });

      applicationBean.init(objectFactory);
    });
  }

  private getBeanFactoryFunction(applicationBean: ApplicationBean): (...args: any[]) => any {
    const configurationInstance = this.applicationConfigurationFactory.getConfigurationInstanceByIndexUnsafe(applicationBean.parentConfigurationIndex);

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
