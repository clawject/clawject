import { LifecycleKind } from '../types/LifecycleKind';
import { ScopeValue } from '../api/decorators';
import { BeanKind } from '../../compile-time/core/bean/BeanKind';

export interface RuntimeBeanMetadata {
  scope: ScopeValue | null;
  lazy: boolean | null;
  kind: BeanKind;
  qualifiedName: string;
}

export interface RuntimeImportMetadata {
  classPropertyName: string;
}

export interface RuntimeLifecycleMetadata {
  [LifecycleKind.POST_CONSTRUCT]: string[];
  [LifecycleKind.PRE_DESTROY]: string[];
}

