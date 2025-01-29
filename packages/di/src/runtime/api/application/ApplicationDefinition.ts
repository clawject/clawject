import { Not } from '../UtilityTypes';
import { ConfigurationDefinition } from '../configuration/ConfigurationDefinition';
import { Symbols } from '../Symbols';

export interface ApplicationDefinition<
  Internal extends boolean = any,
  Lazy extends boolean = any,
  Scope extends string = 'singleton'
> extends ConfigurationDefinition<Internal, Lazy, Scope> {
  readonly [Symbols.Application]: void;

  internal<V extends boolean = true>(v?: V): ApplicationDefinition<V, Lazy, Scope>;
  external<V extends boolean = true>(v?: V): ApplicationDefinition<Not<V>, Lazy, Scope>;
  lazy<V extends boolean = true>(v?: V): ApplicationDefinition<Internal, V, Scope>;
  scope<V extends string = 'singleton'>(v?: V): ApplicationDefinition<Internal, Lazy, V>;
}
