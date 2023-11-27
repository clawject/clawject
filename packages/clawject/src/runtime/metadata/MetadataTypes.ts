import { LifecycleKind } from '../LifecycleKind';
import { ScopeValue } from '../decorators';

export interface RuntimeBeanMetadata {
  scope: ScopeValue | null;
  public: boolean;
  lazy: boolean | null;
}

export interface RuntimeLifecycleMetadata {
  [LifecycleKind.POST_CONSTRUCT]: string[];
  [LifecycleKind.PRE_DESTROY]: string[];
}

