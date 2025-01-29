import { BeanKind } from '../core/bean/BeanKind';

export interface RuntimeBeanMetadata {
  scope: string | number | null;
  lazy: boolean | null;
  kind: BeanKind;
  qualifiedName: string;
}

export interface RuntimeImportMetadata {
  classPropertyName: string;
  lazy: boolean | null;
}

export interface RuntimeLifecycleMetadata {
  POST_CONSTRUCT: string[];
  PRE_DESTROY: string[];
}
