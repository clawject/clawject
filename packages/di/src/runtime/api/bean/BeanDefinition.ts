import { ClassConstructor } from '../ClassConstructor';
import { Not, OmitTuple, TypeHolder } from '../UtilityTypes';
import { Symbols } from '../Symbols';

export type BeanType<T> = T extends ClassConstructor<infer V>
  ? Awaited<V>
  : T extends (...args: any[]) => infer V
  ? Awaited<V>
  : Awaited<T>;

export interface BeanDefinition<
  Value,
  Type = BeanType<Awaited<Value>>,
  Primary extends boolean = any,
  Internal extends boolean = any,
  Embedded extends boolean = any,
  Lazy extends boolean = any,
  Scope extends string = any,
  Names extends readonly string[] = []
> {
  readonly [Symbols.Bean]: void;

  readonly value: Value;

  readonly metadata: {
    readonly primary: Primary;
    readonly internal: Internal;
    readonly embedded: Embedded;
    readonly lazy: Lazy;
    readonly scope: Scope;
    readonly names: Names;
    readonly tags: ReadonlySet<unknown>;
    readonly initMethods: ReadonlySet<keyof Awaited<Type>>;
    readonly destroyMethods: ReadonlySet<keyof Awaited<Type>>;

    readonly rawValueType: TypeHolder<Value>;
    readonly awaitedValueType: TypeHolder<Awaited<Value>>;
    readonly type: TypeHolder<Awaited<Type>>;
  };

  primary<V extends boolean = true>(v?: V): BeanDefinition<Value, Type, V, Internal, Embedded, Lazy, Scope>;
  internal<V extends boolean = true>(v?: V): BeanDefinition<Value, Type, Primary, V, Embedded, Lazy, Scope>;
  external<V extends boolean = true>(v?: V): BeanDefinition<Value, Type, Primary, Not<V>, Embedded, Lazy, Scope>;
  embedded<V extends boolean = true>(v?: V): BeanDefinition<Value, Type, Primary, Internal, V, Lazy, Scope>;
  lazy<V extends boolean = true>(v?: V): BeanDefinition<Value, Type, Primary, Internal, Embedded, V, Scope>;
  scope<V extends string = 'singleton'>(v?: V): BeanDefinition<Value, Type, Primary, Internal, Embedded, Lazy, V>;
  name<V extends string>(v: V): BeanDefinition<Value, Type, Primary, Internal, Embedded, Lazy, Scope, [...Names, V]>;
  omitName<V extends string>(v: V): BeanDefinition<Value, Type, Primary, Internal, Embedded, Lazy, Scope, OmitTuple<Names, V>>;

  type<V>(): BeanDefinition<Value, Type extends V ? V : never, Primary, Internal, Embedded, Lazy, Scope>;

  /**
   * Add tags to the bean definition which can be used to identify bean at runtime.
   */
  tag(...tags: unknown[]): this;
  /**
   * Remove tags from the bean definition.
   * @param tags
   */
  omitTag(...tags: unknown[]): this;

  initMethod<V extends keyof Awaited<Type> | string>(v: V): this;
  destroyMethod<V extends keyof Awaited<Type> | string>(v: V): this;
}
