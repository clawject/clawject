import { Not } from '../UtilityTypes';
import { Symbols } from '../Symbols';

export interface ConfigurationDefinition<
  Internal extends boolean = any,
  Lazy extends boolean = any,
  Scope extends string = 'singleton'
> {
  readonly [Symbols.Configuration]: void;

  readonly metadata: {
    readonly internal: Internal;
    readonly lazy: Lazy;
    readonly scope: Scope;
  };

  internal<V extends boolean = true>(v?: V): ConfigurationDefinition<V, Lazy, Scope>;
  external<V extends boolean = true>(v?: V): ConfigurationDefinition<Not<V>, Lazy, Scope>;
  lazy<V extends boolean = true>(v?: V): ConfigurationDefinition<Internal, V, Scope>;
  scope<V extends string = 'singleton'>(v?: V): ConfigurationDefinition<Internal, Lazy, V>;
}
