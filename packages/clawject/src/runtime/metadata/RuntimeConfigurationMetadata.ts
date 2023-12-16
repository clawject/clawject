import { RuntimeBeanMetadata, RuntimeLifecycleMetadata } from './MetadataTypes';

export interface RuntimeConfigurationMetadata {
  id: number;
  className: string;
  lifecycle: RuntimeLifecycleMetadata;
  beans: Record<string, RuntimeBeanMetadata>;
  lazy: boolean;
  scope: string;
}
