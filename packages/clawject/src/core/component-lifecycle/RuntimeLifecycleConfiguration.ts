import { LifecycleKind } from './LifecycleKind';

export interface RuntimeLifecycleConfiguration {
    lifecycleConfiguration: Record<LifecycleKind, string[]>;
}
