import type ts from 'typescript';
import { ImportDefinitionMetadata } from './ImportDefinitionMetadata';
import { TypeMetadataParser } from '../TypeMetadataParser';
import { readMetadataTypesFromClassPropertySymbol } from '../readMetadataTypesFromClassPropertySymbol';

export const readImportDefinitionMetadata = (
  property: ts.Symbol
): ImportDefinitionMetadata | null => {
  const propertyNameToType = readMetadataTypesFromClassPropertySymbol(property);
  if (!propertyNameToType) {
    //TODO report metadata error
    return null;
  }

  const metadata = {
    type: TypeMetadataParser.getTypeHolderType(propertyNameToType['type']),
  };

  if (metadata.type === null) {
    //TODO: report metadata error
    return null;
  }

  return metadata as ImportDefinitionMetadata;
};
