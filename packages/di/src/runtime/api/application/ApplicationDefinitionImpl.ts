import { Symbols } from '../Symbols';
import { ApplicationDefinition } from './ApplicationDefinition';

export class ApplicationDefinitionImpl implements ApplicationDefinition<any> {
  [Symbols.Configuration] = undefined;
  [Symbols.Application] = undefined;
  metadata: ApplicationDefinition<any>['metadata'];

  constructor(metadata?: ApplicationDefinition<any>['metadata']) {
    this.metadata =
      metadata ??
      ({
        internal: true,
        lazy: false,
        scope: 'singleton',
      } as any);
  }

  internal<V extends boolean = true>(v?: V): any {
    return new ApplicationDefinitionImpl({
      ...this.metadata,
      internal: v ?? true,
    } as any);
  }

  external<V extends boolean = true>(v?: V): any {
    return new ApplicationDefinitionImpl({
      ...this.metadata,
      internal: !v,
    } as any);
  }

  lazy<V extends boolean = true>(v?: V): any {
    return new ApplicationDefinitionImpl({
      ...this.metadata,
      lazy: v ?? true,
    } as any);
  }

  scope<V extends string = 'singleton'>(v?: V): any {
    return new ApplicationDefinitionImpl({
      ...this.metadata,
      scope: v ?? 'singleton',
    } as any);
  }
}
