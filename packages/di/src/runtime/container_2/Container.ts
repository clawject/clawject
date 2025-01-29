import { ApplicationMetadataV2 } from '@clawject/core/runtime-metadata/v2/ApplicationMetadataV2';
import { ModuleLoader } from './ModuleLoader';
import { Import } from '../api/import/Import';
import { ContainerScope } from './ContainerScope';
import { SingletonContainerScope } from './SingletonContainerScope';
import { ContainerScopeManager } from './ContainerScopeManager';
import { MetadataAccessor } from './MetadataAccessor';

export class Container {
  constructor(
    public readonly metadata: ApplicationMetadataV2,
    private readonly additionalScopes: Map<string, ContainerScope>,
  ) {}

  //TODO
  public readonly applicationId = 'TODO RANDOM ID HERE OR ID FROM CONSTRUCTOR';
  public readonly container = this;
  public readonly moduleResolver = new ModuleLoader(this);
  public readonly scopeManager = new ContainerScopeManager(this);
  public readonly metadataAccessor = new MetadataAccessor(this.metadata);

  async start(classConstructor: any): Promise<void> {
    const singletonScope = new SingletonContainerScope();
    await this.scopeManager.registerScope('singleton', singletonScope);
    for (const [name, scope] of this.additionalScopes) {
      await this.scopeManager.registerScope(name, scope);
    }

    const moduleSymbol = this.metadata.rootConfigurationSymbol;
    const importDefinition = Import(classConstructor);
    const resolvedRootModule = await this.moduleResolver.resolveWithImport(moduleSymbol, importDefinition);
  }
}
