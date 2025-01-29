import { BeanDependencyMetadata } from '@clawject/core/runtime-metadata/v2/ApplicationMetadataV2';
import { BeanDefinition } from '../api/bean/BeanDefinition';
import type { Container } from './Container';
import { ResolvedDependencyKind } from '@clawject/core/core/dependency-resolver/ResolvedDependency';
import { LazyConfigurationLoaderImpl } from '../LazyConfigurationLoaderImpl';
import { ConfigurationRefImpl } from '../ConfigurationRefImpl';
import { BeanKind } from '@clawject/core/core/bean/BeanKind';
import { ResolvedModule } from './ResolvedModule';

export class ResolvedProvider {
  constructor(
    private container: Container,
    public readonly providerSymbol: symbol,
    public readonly beanDefinition: BeanDefinition<any>,
    public readonly parentResolvedModule: ResolvedModule,
  ) {}

  async instantiate(contextId: unknown): Promise<unknown> {
    const beanMetadata = this.container.metadataAccessor.providerSymbolMetadata(
      this.providerSymbol
    );
    const [property, kind, configurationSymbol] = beanMetadata;

    switch (kind) {
      case BeanKind.V2_CLASS: {
        const [
          constructor,
          dependencies,
        ] = await Promise.all([
          this.beanDefinition.value,
          this.getDependencies(contextId),
        ]);

        return new constructor(...dependencies);
      }
      case BeanKind.V2_FACTORY:
      case BeanKind.V2_LIFECYCLE: {
        const [
          factory,
          dependencies,
        ] = await Promise.all([
          this.beanDefinition.value,
          this.getDependencies(contextId),
        ]);

        return factory(...dependencies);
      }
      case BeanKind.V2_VALUE: {
        return this.beanDefinition.value;
      }
    }
  }

  private async getDependencies(contextId: unknown): Promise<unknown[]> {
    const dependenciesMetadata = this.container.metadataAccessor.providerDependenciesMetadata(this.providerSymbol);
    if (!dependenciesMetadata) {
      throw new Error('Dependencies metadata not found');
    }

    return Promise.all(
      dependenciesMetadata.map((dependency) => this.resolveDependency(contextId, dependency))
    );
  }

  private async resolveDependency(
    contextId: unknown,
    dependency: BeanDependencyMetadata
  ): Promise<unknown> {
    const [dependencyKind, target] = dependency;
    if (dependencyKind === ResolvedDependencyKind.LazyConfigurationLoader) {
      return new LazyConfigurationLoaderImpl(
        async() => {
          const resolvedModule = await this.container.moduleResolver.resolve(target);

          return new ConfigurationRefImpl(resolvedModule.instance);
        }
      );
    }

    if (dependencyKind !== ResolvedDependencyKind.Bean) {
      throw new Error('Not implemented');
    }

    const targetProviderMetadata =
      this.container.metadataAccessor.providerSymbolMetadata(target);
    if (!targetProviderMetadata) {
      throw new Error('Target provider metadata not found');
    }
    const [property, kind, moduleSymbol] = targetProviderMetadata;
    const targetResolvedModule = await this.container.moduleResolver.resolve(
      moduleSymbol
    );
    const targetResolvedProvider = targetResolvedModule.resolveProvider(target);
    const targetResolvedProviderScope = this.container.scopeManager.getScope(
      targetResolvedProvider.beanDefinition.metadata.scope
    );

    return targetResolvedProviderScope.resolve(
      this.container.applicationId,
      contextId,
      target,
      targetResolvedProvider.beanDefinition,
      this.container.scopeManager.getScope(this.beanDefinition.metadata.scope),
    )
  }
}
