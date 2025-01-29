import { ApplicationMetadataV2, BeanDependencyMetadata, BeanMetadata, ImportMetadata } from '@clawject/core/runtime-metadata/v2/ApplicationMetadataV2';

//TODO errors should be metadata errors
export class MetadataAccessor {
  constructor(
    private readonly metadata: ApplicationMetadataV2,
  ) {}

  moduleImporterSymbols(moduleSymbol: symbol): symbol[] {
    const symbols = this.metadata.configurationImporters.get(moduleSymbol);
    if (!symbols) {
      throw new Error('Configuration importers not found');
    }
    return symbols;
  }

  moduleImportSymbols(moduleSymbol: symbol): symbol[] {
    const symbols = this.metadata.configurationImportSymbols.get(moduleSymbol);
    if (!symbols) {
      throw new Error('Configuration imports not found');
    }
    return symbols;
  }

  importSymbolMetadata(importSymbol: symbol): ImportMetadata {
    const metadata = this.metadata.importSymbolToMetadata.get(importSymbol);
    if (!metadata) {
      throw new Error('Import metadata not found');
    }
    return metadata
  }

  moduleProviderSymbols(moduleSymbol: symbol): symbol[] {
    const symbols = this.metadata.configurationBeanSymbols.get(moduleSymbol);
    if (!symbols) {
      throw new Error('Configuration bean symbols not found');
    }
    return symbols;
  }

  providerSymbolMetadata(providerSymbol: symbol): BeanMetadata {
    const metadata = this.metadata.beanSymbolToMetadata.get(providerSymbol);
    if (!metadata) {
      throw new Error('Provider metadata not found');
    }
    return metadata;
  }

  providerDependenciesMetadata(providerSymbol: symbol): BeanDependencyMetadata[] {
    const metadata = this.metadata.beanDependencies.get(providerSymbol);
    if (!metadata) {
      throw new Error('Provider dependencies not found');
    }
    return metadata;
  }
}
