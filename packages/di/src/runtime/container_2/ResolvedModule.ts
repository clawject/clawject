import { Predicates } from '../Predicates';
import type { Container } from './Container';
import { ResolvedProvider } from './ResolvedProvider';
import { BeanDefinition } from '../api/bean/BeanDefinition';

export class ResolvedModule {
  constructor(
    private container: Container,
    public instance: any,
    public moduleSymbol: symbol
  ) {
    this.initResolvedProviders();
  }

  public resolvedProviders = new Map<symbol, ResolvedProvider>();
  private initResolvedProviders(): void {
    const providerDefinitions = this.collectProviderDefinitions();
    providerDefinitions.map(([targetProviderSymbol, providerDefinition]) => {
      this.resolvedProviders.set(
        targetProviderSymbol,
        new ResolvedProvider(this.container, targetProviderSymbol, providerDefinition, this)
      );
    });
  }

  resolveProvider(providerSymbol: symbol): ResolvedProvider {
    const resolvedProvider = this.resolvedProviders.get(providerSymbol);
    if (!resolvedProvider) {
      throw new Error('Provider not found');
    }
    return resolvedProvider;
  }

  private collectProviderDefinitions(): [targetProviderSymbol: symbol, providerDefinition: BeanDefinition<any>][] {
    const providerSymbols = this.container.metadataAccessor.moduleProviderSymbols(this.moduleSymbol);

    return providerSymbols.map((providerSymbol) => {
      const providerMetadata = this.container.metadataAccessor.providerSymbolMetadata(providerSymbol);
      const [property] = providerMetadata;

      const maybeProviderDefinition = this.instance[property[0]];
      if (Predicates.isBeanDefinition(maybeProviderDefinition)) {
        return [providerSymbol, maybeProviderDefinition];
      }

      throw new Error('Invalid provider definition');
    });
  }
}
