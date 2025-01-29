import { LifecyclePart } from './LifecyclePart';
import { LifecycleDefinitionImpl } from './LifecycleDefinitionImpl';
import { LifecycleDefinition } from './LifecycleDefinition';

const Lifecycle = <
  Callback extends (...args: any[]) => any,
  Part extends LifecyclePart
>(
    callback: Callback,
    part: Part
  ): LifecycleDefinition<Callback, Part> => {
  return new LifecycleDefinitionImpl(callback, part);
};

export const PostConstruct = <Callback extends (...args: any[]) => any>(
  callback: Callback
) => Lifecycle(callback, 'post-construct');

export const PreDestroy = <Callback extends (...args: any[]) => any>(
  callback: Callback
) => Lifecycle(callback, 'pre-destroy');
