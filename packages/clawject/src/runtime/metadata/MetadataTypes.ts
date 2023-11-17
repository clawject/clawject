import { ScopeValue } from '../decorators';
import { LifecycleKind } from '../../compile-time/core/component-lifecycle/LifecycleKind';

export interface RuntimeBeanMetadata {
  scope: ScopeValue | null;
  public: boolean;
  lazy: boolean | null;
}

export interface RuntimeLifecycleMetadata {
  [LifecycleKind.POST_CONSTRUCT]: string[];
  [LifecycleKind.PRE_DESTROY]: string[];
}

