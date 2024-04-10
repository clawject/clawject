import { BeanMetadata } from './BeanMetadata';
import { ObjectFactoryResult } from './ObjectFactory';

/**
 *  @internalApi Changes to it will not be considered a breaking change in terms of semantic versioning.
 *
 *  @public
 *  */
export interface BeanProcessorFactoryMetadata {
  readonly beanMetadata: BeanMetadata;
  readonly factory: (...injectedBeans: unknown[]) => ObjectFactoryResult | Promise<ObjectFactoryResult>;
}

/**
 *  @internalApi Changes to it will not be considered a breaking change in terms of semantic versioning.
 *
 *  @public
 *  */
export interface BeanProcessor {
  processFactory?(factoryMetadata: BeanProcessorFactoryMetadata): BeanProcessorFactoryMetadata['factory'];
  onBeansInitialized?(): void;
}
