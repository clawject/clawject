import { ImportDefinition } from '../api/import/ImportDefinition';
import { ResolvedModule } from './ResolvedModule';
import type { Container } from './Container';
import { Predicates } from '../Predicates';
import { ProviderRegistrationRequest } from './ContainerScope';

export class ModuleLoader {
  constructor(private container: Container) {}

  public resolvedModules = new Map<symbol, Promise<ResolvedModule>>();
  public resolvedModulesSync = new Map<symbol, ResolvedModule>();

  async resolve(moduleSymbol: symbol): Promise<ResolvedModule> {
    const resolvedModules = new Set<symbol>();
    const resolvedModule = await this.resolveCached(
      moduleSymbol,
      resolvedModules
    );
    await this.registerScopedProviders(resolvedModules);
    return resolvedModule;
  }

  async resolveWithImport(
    moduleSymbol: symbol,
    importDefinition: ImportDefinition<any>
  ): Promise<ResolvedModule> {
    const resolvedModules = new Set<symbol>();
    const resolvedModule = await this.resolveWithImportCached(
      moduleSymbol,
      importDefinition,
      resolvedModules
    );
    await this.registerScopedProviders(resolvedModules);
    return resolvedModule;
  }

  private async registerScopedProviders(
    resolvedModules: Set<symbol>
  ): Promise<void> {
    const providerRegistrationRequests = new Map<
      string,
      ProviderRegistrationRequest[]
    >();
    for (const resolvedModule of resolvedModules) {
      const module = this.resolvedModulesSync.get(resolvedModule);
      if (!module) {
        throw new Error('Resolved module not found');
      }

      for (const [, resolvedProvider] of module.resolvedProviders) {
        if (
          !providerRegistrationRequests.has(
            resolvedProvider.beanDefinition.metadata.scope
          )
        ) {
          providerRegistrationRequests.set(
            resolvedProvider.beanDefinition.metadata.scope,
            []
          );
        }
        const requests = providerRegistrationRequests.get(
          resolvedProvider.beanDefinition.metadata.scope
        )!;
        requests.push({
          key: resolvedProvider.providerSymbol,
          definition: resolvedProvider.beanDefinition,
          factory: (contextId: unknown) =>
            resolvedProvider.instantiate(contextId),
        });
      }
    }

    await Promise.all(
      Array.from(providerRegistrationRequests.entries()).map(
        ([scopeName, requests]) => {
          const scope = this.container.scopeManager.getScope(scopeName);

          return scope.registerProviders(
            this.container.applicationId,
            requests
          );
        }
      )
    );
  }

  private resolveCached(
    moduleSymbol: symbol,
    resolvedModules: Set<symbol>
  ): Promise<ResolvedModule> {
    if (!this.resolvedModules.has(moduleSymbol)) {
      this.resolvedModules.set(
        moduleSymbol,
        this._resolve(moduleSymbol, resolvedModules).then((resolved) => {
          this.resolvedModulesSync.set(moduleSymbol, resolved);
          return resolved;
        })
      );
    }

    return this.resolvedModules.get(moduleSymbol)!;
  }

  async _resolve(
    moduleSymbol: symbol,
    resolvedModules: Set<symbol>
  ): Promise<ResolvedModule> {
    resolvedModules.add(moduleSymbol);
    const configurationImporters =
      this.container.metadataAccessor.moduleImporterSymbols(moduleSymbol);
    if (configurationImporters.length === 0) {
      throw new Error('Module is not imported by any configuration');
    }

    let parentImportSymbol = configurationImporters[0];
    for (const configurationImporterSymbol of configurationImporters) {
      if (this.resolvedModules.has(configurationImporterSymbol)) {
        parentImportSymbol = configurationImporterSymbol;
        break;
      }
    }

    const resolvedParentModule = await this.resolveCached(
      parentImportSymbol,
      resolvedModules
    );
    const parentImportSymbols =
      this.container.metadataAccessor.moduleImportSymbols(parentImportSymbol);

    let moduleImportDefinition: ImportDefinition<any> | undefined = undefined;
    for (const parentImportSymbol of parentImportSymbols) {
      const importMetadata =
        this.container.metadataAccessor.importSymbolMetadata(
          parentImportSymbol
        );
      const [property, targetConfiguration] = importMetadata;

      if (targetConfiguration === moduleSymbol) {
        const importDefinition = resolvedParentModule.instance[property];
        if (!Predicates.isImportDefinition(importDefinition)) {
          throw new Error('Import definition not found');
        }

        moduleImportDefinition = importDefinition;
        break;
      }
    }

    if (!moduleImportDefinition) {
      throw new Error('Module import definition not found');
    }

    return this._resolveWithImport(
      moduleSymbol,
      moduleImportDefinition,
      resolvedModules
    );
  }

  private resolveWithImportCached(
    moduleSymbol: symbol,
    importDefinition: ImportDefinition<any>,
    resolvedModules: Set<symbol>
  ): Promise<ResolvedModule> {
    if (!this.resolvedModules.has(moduleSymbol)) {
      this.resolvedModules.set(
        moduleSymbol,
        this._resolveWithImport(
          moduleSymbol,
          importDefinition,
          resolvedModules
        ).then((resolved) => {
          this.resolvedModulesSync.set(moduleSymbol, resolved);
          return resolved;
        })
      );
    }

    return this.resolvedModules.get(moduleSymbol)!;
  }

  private async _resolveWithImport(
    moduleSymbol: symbol,
    importDefinition: ImportDefinition<any>,
    resolvedModules: Set<symbol>
  ): Promise<ResolvedModule> {
    resolvedModules.add(moduleSymbol);
    const [moduleCls, params] = await Promise.all([
      importDefinition.classConstructor,
      importDefinition.constructorParams(),
    ]);

    let moduleInstance;
    try {
      //TODO use callable flag instead because invocation of `function Foo() {}` will not throw an error
      moduleInstance = new moduleCls(...params);
    } catch (_) {
      const lazyModuleCls = await moduleCls();
      moduleInstance = new lazyModuleCls(...params);
    }

    const resolved = new ResolvedModule(
      this.container,
      moduleInstance,
      moduleSymbol
    );
    await this.initResolvedModuleImports(resolved, resolvedModules);
    return resolved;
  }

  private async initResolvedModuleImports(
    resolvedModule: ResolvedModule,
    resolvedModules: Set<symbol>
  ): Promise<void> {
    // Collecting import definitions and resolving non-lazy modules
    const importDefinitions = this.collectImportDefinitions(resolvedModule);
    const importDefinitionsToResolve = importDefinitions.filter(
      ([_, importDefinition]) => {
        return !importDefinition.metadata.lazy;
      }
    );
    await Promise.all(
      importDefinitionsToResolve.map(
        ([targetModuleSymbol, importDefinition]) => {
          return this.resolveWithImportCached(
            targetModuleSymbol,
            importDefinition,
            resolvedModules
          );
        }
      )
    );
  }

  private collectImportDefinitions(
    resolvedModule: ResolvedModule
  ): [targetModuleSymbol: symbol, importDefinition: ImportDefinition<any>][] {
    const importSymbols = this.container.metadataAccessor.moduleImportSymbols(
      resolvedModule.moduleSymbol
    );

    return importSymbols.map((symbol) => {
      const importMetadata =
        this.container.metadataAccessor.importSymbolMetadata(symbol);
      const [property, targetModuleSymbol] = importMetadata;

      const maybeImportDefinition = resolvedModule.instance[
        property
      ] as unknown;

      if (Predicates.isImportDefinition(maybeImportDefinition)) {
        return [targetModuleSymbol, maybeImportDefinition];
      }

      throw new Error('Invalid import definition');
    });
  }
}
