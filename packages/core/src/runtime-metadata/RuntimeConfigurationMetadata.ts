import { RuntimeBeanMetadata, RuntimeImportMetadata, RuntimeLifecycleMetadata } from './MetadataTypes';

export interface RuntimeConfigurationMetadata {
  className: string;
  lifecycle: RuntimeLifecycleMetadata;
  imports: RuntimeImportMetadata[];
  beans: Record<string, RuntimeBeanMetadata>;
  lazy: boolean;
  scope: string;
}
