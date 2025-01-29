import { BeanDefinition, BeanType } from './BeanDefinition';
import { Symbols } from '../Symbols';
import { JustReturn } from '../JustReturn';

export class BeanDefinitionImpl<
  Value,
  Type = BeanType<Value>,
  Primary extends boolean = false,
  Internal extends boolean = false,
  Embedded extends boolean = false,
  Lazy extends boolean = false,
  Scope extends string = 'singleton',
  Names extends readonly string[] = []
> implements
    BeanDefinition<
      Value,
      Type,
      Primary,
      Internal,
      Embedded,
      Lazy,
      Scope,
      Names
    >
{
  [Symbols.Bean] = undefined;
  value: Value;
  metadata: any;

  constructor(value: Value, metadata?: (typeof this)['metadata']) {
    this.value = value;
    this.metadata =
      metadata ??
      ({
        primary: false,
        internal: true,
        embedded: false,
        lazy: false,
        scope: 'singleton',
        names: [] as any,
        tags: new Set(),
        initMethods: new Set(),
        destroyMethods: new Set(),
        type: JustReturn,
        awaitedValueType: JustReturn,
        rawValueType: JustReturn,
      } as any);
  }

  primary<V extends boolean = true>(v?: V | undefined): any {
    return new BeanDefinitionImpl(this.value, {
      ...this.metadata,
      primary: v ?? true,
    } as any);
  }

  internal<V extends boolean = true>(v?: V | undefined): any {
    return new BeanDefinitionImpl(this.value, {
      ...this.metadata,
      internal: v ?? true,
    } as any);
  }

  external<V extends boolean = true>(v?: V | undefined): any {
    return new BeanDefinitionImpl(this.value, {
      ...this.metadata,
      internal: !v,
    } as any);
  }

  embedded<V extends boolean = true>(v?: V | undefined): any {
    return new BeanDefinitionImpl(this.value, {
      ...this.metadata,
      embedded: v ?? true,
    } as any);
  }

  lazy<V extends boolean = true>(v?: V | undefined): any {
    return new BeanDefinitionImpl(this.value, {
      ...this.metadata,
      lazy: v ?? true,
    } as any);
  }

  scope<V extends string = 'singleton'>(v?: V | undefined): any {
    return new BeanDefinitionImpl(this.value, {
      ...this.metadata,
      scope: v ?? 'singleton',
    } as any);
  }

  type(): any {
    return new BeanDefinitionImpl(this.value, { ...this.metadata }) as any;
  }

  name<V extends string>(v: V): any {
    const newNames = Array.from(new Set([...this.metadata.names, v])) as any;

    return new BeanDefinitionImpl(this.value, {
      ...this.metadata,
      names: newNames,
    } as any);
  }

  omitName<V extends string>(v: V): any {
    return new BeanDefinitionImpl(this.value, {
      ...this.metadata,
      names: this.metadata.names.filter((name) => name !== v),
    } as any);
  }

  tag(...tags: unknown[]): any {
    const newTags = new Set([...this.metadata.tags, ...tags]);

    return new BeanDefinitionImpl(this.value, {
      ...this.metadata,
      tags: newTags,
    } as any);
  }
  omitTag(...tags: unknown[]): any {
    const newTags = new Set([...this.metadata.tags]);

    for (const tag of tags) {
      newTags.delete(tag);
    }

    return new BeanDefinitionImpl(this.value, {
      ...this.metadata,
      tags: newTags,
    } as any);
  }

  initMethod(v: any): any {
    const newInitMethods = new Set([...this.metadata.initMethods, v]);

    return new BeanDefinitionImpl(this.value, {
      ...this.metadata,
      initMethods: newInitMethods,
    } as any);
  }

  destroyMethod(v: any): any {
    const newDestroyMethods = new Set([...this.metadata.destroyMethods, v]);

    return new BeanDefinitionImpl(this.value, {
      ...this.metadata,
      destroyMethods: newDestroyMethods,
    } as any);
  }
}
