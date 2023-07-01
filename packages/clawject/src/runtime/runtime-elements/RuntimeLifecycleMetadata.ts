import { LifecycleKind } from '../../compile-time/core/component-lifecycle/LifecycleKind';

export type RuntimeLifecycleMetadata = Record<LifecycleKind, string[]>;
