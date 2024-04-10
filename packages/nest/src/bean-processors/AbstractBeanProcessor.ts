import { BeanProcessor, BeanProcessorFactoryMetadata, ClassConstructor } from '@clawject/di';

export abstract class AbstractBeanProcessor implements BeanProcessor {
  abstract processFactory(factoryMetadata: BeanProcessorFactoryMetadata): BeanProcessorFactoryMetadata['factory'];

  protected isDesiredBean<P extends ClassConstructor<any>, N extends keyof InstanceType<P>>(factoryMetadata: BeanProcessorFactoryMetadata, configurationClass: P, beanName: N) {
    return factoryMetadata.beanMetadata.parentConfigurationClassConstructor === configurationClass && factoryMetadata.beanMetadata.classPropertyName === beanName;
  }
}
