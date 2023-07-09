import { LifecycleKind } from '../../compile-time/core/component-lifecycle/LifecycleKind';

export interface RuntimeLifecycleMetadata {
  [LifecycleKind.POST_CONSTRUCT]: string[];
  [LifecycleKind.PRE_DESTROY]: string[];
}
