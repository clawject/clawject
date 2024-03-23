import { LifecycleKind } from '../types/LifecycleKind';
import { BeanKind } from '../../compile-time/core/bean/BeanKind';
import { ScopeValue } from '../api/Scope';

export interface RuntimeBeanMetadata {
  scope: ScopeValue | null;
  lazy: boolean | null;
  kind: BeanKind;
  qualifiedName: string;
}

export interface RuntimeImportMetadata {
  classPropertyName: string;
  lazy: boolean | null;
}

export interface RuntimeLifecycleMetadata {
  [LifecycleKind.POST_CONSTRUCT]: string[];
  [LifecycleKind.PRE_DESTROY]: string[];
}

