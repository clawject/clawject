import { ConfigurationDefinition } from './ConfigurationDefinition';
import { Symbols } from '../Symbols';

export class ConfigurationDefinitionImpl
implements ConfigurationDefinition<any>
{
  [Symbols.Configuration] = undefined;
  metadata: ConfigurationDefinition<any>['metadata'];

  constructor(metadata?: ConfigurationDefinition<any>['metadata']) {
    this.metadata =
      metadata ??
      ({
        internal: true,
        lazy: false,
        scope: 'singleton',
      } as any);
  }

  internal<V extends boolean = true>(v?: V): any {
    return new ConfigurationDefinitionImpl({
      ...this.metadata,
      internal: v ?? true,
    } as any);
  }

  external<V extends boolean = true>(v?: V): any {
    return new ConfigurationDefinitionImpl({
      ...this.metadata,
      internal: !v,
    } as any);
  }

  lazy<V extends boolean = true>(v?: V): any {
    return new ConfigurationDefinitionImpl({
      ...this.metadata,
      lazy: v ?? true,
    } as any);
  }

  scope<V extends string = 'singleton'>(v?: V): any {
    return new ConfigurationDefinitionImpl({
      ...this.metadata,
      scope: v ?? 'singleton',
    } as any);
  }
}
