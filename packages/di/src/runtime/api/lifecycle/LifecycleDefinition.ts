import { Symbols } from '../Symbols';
import { LifecyclePart } from './LifecyclePart';
import { TypeHolder } from '../UtilityTypes';

export interface LifecycleDefinition<
  Callback extends (...args: any[]) => any,
  Part extends LifecyclePart
> {
  [Symbols.Lifecycle]: void;

  readonly callback: Callback;
  readonly metadata: {
    readonly part: Part;
    readonly callbackType: TypeHolder<Callback>;
  }
}
