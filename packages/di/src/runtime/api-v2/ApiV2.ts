//TODO narrowing
export interface DependencyDefinition<Value, Primary extends boolean = false, Internal extends boolean = false, External extends boolean = true, Embedded extends boolean = false, Lazy extends boolean = false, Scope extends string = 'singleton'> {
  readonly value: Value;

  readonly metadata: {
    readonly primary: Primary;
    readonly internal: Internal;
    readonly external: External;
    readonly embedded: Embedded;
    readonly lazy: Lazy;
    readonly scope: Scope;
  }

  primary<V extends boolean = true>(v?: V): DependencyDefinition<Value, V, Internal, External, Embedded, Lazy, Scope>;
  internal<V extends boolean = false>(v?: V): DependencyDefinition<Value, Primary, V, External, Embedded, Lazy, Scope>;
  external<V extends boolean = true>(v?: V): DependencyDefinition<Value, Primary, Internal, V, Embedded, Lazy, Scope>;
  embedded<V extends boolean = true>(v?: V): DependencyDefinition<Value, Primary, Internal, External, V, Lazy, Scope>;
  lazy<V extends boolean = true>(v?: V): DependencyDefinition<Value, Primary, Internal, External, Embedded, V, Scope>;
  scope<V extends string = 'singleton'>(v?: V): DependencyDefinition<Value, Primary, Internal, External, Embedded, Lazy, V>;
}

export const Dep = <T>(value: T): DependencyDefinition<T> => ({} as any);

interface ConfigurationDefinition<Primary extends boolean = false, Internal extends boolean = false, External extends boolean = true, Lazy extends boolean = false, Scope extends string = 'singleton'> {
  readonly metadata: {
    readonly primary: Primary;
    readonly internal: Internal;
    readonly external: External;
    readonly lazy: Lazy;
    readonly scope: Scope;
  }

  primary<V extends boolean = true>(v?: V): ConfigurationDefinition<V, Internal, External, Lazy, Scope>;
  internal<V extends boolean = false>(v?: V): ConfigurationDefinition<Primary, V, External, Lazy, Scope>;
  external<V extends boolean = true>(v?: V): ConfigurationDefinition<Primary, Internal, V, Lazy, Scope>;
  lazy<V extends boolean = true>(v?: V): ConfigurationDefinition<Primary, Internal, External, V, Scope>;
  scope<V extends string = 'singleton'>(v?: V): ConfigurationDefinition<Primary, Internal, External, Lazy, V>;
}

export const Conf = (): ConfigurationDefinition => ({} as any);
