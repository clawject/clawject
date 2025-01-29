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
  Constructor extends MaybePromise<ClassConstructor<any>>,
  Lazy extends boolean = any
> {
  readonly [Symbols.Import]: void;

  readonly classConstructor: Constructor;
  readonly constructorParams: () => MaybePromise<
    ConstructorParameters<Awaited<Constructor>>
  >;
  readonly metadata: {
    readonly type: TypeHolder<InstanceType<Awaited<Constructor>>>;
    readonly lazy: Lazy;
  };

  lazy<V extends boolean = true>(v?: V): ImportDefinition<Constructor, V>;
}
