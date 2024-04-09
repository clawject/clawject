import { ClassConstructor } from '../api/ClassConstructor';
import { ConfigurationRef } from '../api/clawject-dependency/ConfigurationRef';
import { ClawjectContainer } from '../container/ClawjectContainer';
import { ApplicationConfiguration } from '../container/ApplicationConfiguration';
import { RuntimeErrors } from '../api/RuntimeErrors';
import { RuntimeBeanMetadata } from '../metadata/MetadataTypes';

export class ConfigurationRefImpl implements ConfigurationRef {
  constructor(
    private container: ClawjectContainer,
    private applicationConfiguration: ApplicationConfiguration,
  ) {
    this.classConstructor = applicationConfiguration.classConstructor;
    this.instance = applicationConfiguration.instance;

    this.beansMetadataEntries = Object.entries(applicationConfiguration.metadata.beans);
  }

  readonly classConstructor: ClassConstructor<any>;
  readonly instance: object;

  private readonly beansMetadataEntries: [string, RuntimeBeanMetadata][];

  getBean(beanName: string): any | Promise<any> {
    const beansMetadata = this.beansMetadataEntries.filter(it => {
      return it[1].qualifiedName === beanName;
    });

    if (beansMetadata.length === 0) {
      throw new RuntimeErrors.NoSuchBeanDefinitionError(`No bean definition found for bean name: ${beanName}`);
    }

    if (beansMetadata.length > 1) {
      throw new RuntimeErrors.AmbiguousBeanDefinitionError(`Multiple bean definitions found for bean name: ${beanName}`);
    }

    const [classPropertyName] = beansMetadata[0];

    const applicationBean = this.container.applicationBeanFactory.applicationBeanFinder.find(this.applicationConfiguration.index, classPropertyName);

    return applicationBean.getInjectionValue();
  }

  findBean(predicate: (beanName: string, resolvedBeanConstructor: ClassConstructor<any> | null) => boolean): any | Promise<any> | null {
    for (const beanMetadata of this.beansMetadataEntries) {
      const [beanName, metadata] = beanMetadata;

      const applicationBean = this.container.applicationBeanFactory.applicationBeanFinder.find(this.applicationConfiguration.index, beanName);

      if (predicate(beanName, applicationBean.classConstructor)) {
        return applicationBean.getInjectionValue();
      }
    }

    return null;
  }

  filterBeans(predicate: (beanName: string, resolvedClassConstructor: ClassConstructor<any> | null) => boolean): any[] | Promise<any[]> {
    const beans: any[] = [];
    let havePromise = false;

    for (const beanMetadata of this.beansMetadataEntries) {
      const [beanName, metadata] = beanMetadata;

      const applicationBean = this.container.applicationBeanFactory.applicationBeanFinder.find(this.applicationConfiguration.index, beanName);

      if (predicate(beanName, applicationBean.classConstructor)) {
        const injectionValue = applicationBean.getInjectionValue();

        if (!havePromise && injectionValue instanceof Promise) {
          havePromise = true;
        }

        beans.push(injectionValue);
      }
    }

    return havePromise ? Promise.all(beans) : beans;
  }

  readonly ___clawject_uid___ = '1' as const;
}
