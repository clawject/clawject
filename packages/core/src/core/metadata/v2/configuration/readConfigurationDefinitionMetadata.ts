import type ts from 'typescript';
import { ConfigurationDefinitionMetadata } from './ConfigurationDefinitionMetadata';
import { TypeMetadataParser } from '../TypeMetadataParser';
import { readMetadataTypesFromClassPropertySymbol } from '../readMetadataTypesFromClassPropertySymbol';

export const readConfigurationDefinitionMetadata = (
  property: ts.Symbol | null
): ConfigurationDefinitionMetadata | null => {
  if (!property) {
    return {
      internal: true,
    };
  }

  const propertyNameToType = readMetadataTypesFromClassPropertySymbol(property);
  if (!propertyNameToType) {
    //TODO report metadata error
    return null;
  }

  const metadata = {
    internal: TypeMetadataParser.getBoolean(propertyNameToType['internal']) ?? true,
  };

  return metadata as ConfigurationDefinitionMetadata;
};
