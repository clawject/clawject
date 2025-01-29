import { LifecyclePart } from './LifecyclePart';
import { LifecycleDefinition } from './LifecycleDefinition';
import { Symbols } from '../Symbols';
import { JustReturn } from '../JustReturn';

export class LifecycleDefinitionImpl<
  Callback extends (...args: any[]) => any,
  Part extends LifecyclePart
> implements LifecycleDefinition<Callback, Part>
{
  [Symbols.Lifecycle] = undefined;

  public readonly metadata: LifecycleDefinition<Callback, Part>['metadata'];

  constructor(
    public readonly callback: Callback,
    public readonly part: LifecycleDefinition<Callback, Part>['metadata']['part'],
  ) {
    this.metadata = {
      part,
      callbackType: JustReturn,
    };
  }
}
