import { ClassConstructor } from '../ClassConstructor';
import { TypeHolder } from '../UtilityTypes';
import { MaybePromise } from '../../types/MaybePromise';
import { Symbols } from '../Symbols';

/**
 * Object that is produced by {@link Import} function.
 *
 * @public
 */
export interface ImportDefinition<
  Value extends () => MaybePromise<ClassConstructor<any>>,
  Lazy extends boolean = false,
> {
  readonly [Symbols.Import]: void;

  readonly value: () => Value;
  readonly constructorParams: () => MaybePromise<
    ConstructorParameters<Awaited<ReturnType<Value>>>
  >;
  readonly metadata: {
    readonly type: TypeHolder<InstanceType<Awaited<ReturnType<Value>>>>;
    readonly lazy: Lazy;
  };

  lazy<V extends boolean = true>(v?: V): ImportDefinition<Value, V>;
}
