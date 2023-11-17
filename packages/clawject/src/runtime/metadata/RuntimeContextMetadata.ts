import { RuntimeBeanMetadata, RuntimeLifecycleMetadata } from './MetadataTypes';
import { CatContext } from '../CatContext';

export interface RuntimeContextMetadata {
  id: number;
  contextName: string;
  lifecycle: RuntimeLifecycleMetadata;
  beans: Record<string, RuntimeBeanMetadata>;
  lazy: boolean;
  scope: string;
  contextBuilder: () => BuiltContext;
}

export type BuiltContext = {
  instance: CatContext;
  factories: RuntimeContextFactoriesMetadata;
}

export type RuntimeContextFactoriesMetadata = Record<string, () => any>;
