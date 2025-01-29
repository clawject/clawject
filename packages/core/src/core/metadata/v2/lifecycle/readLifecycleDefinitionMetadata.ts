import type ts from 'typescript';
import { TypeMetadataParser } from '../TypeMetadataParser';
import { readMetadataTypesFromClassPropertySymbol } from '../readMetadataTypesFromClassPropertySymbol';
import { LifecycleDefinitionMetadata } from './LifecycleDefinitionMetadata';

export const readLifecycleDefinitionMetadata = (
  property: ts.Symbol
): LifecycleDefinitionMetadata | null => {
  const propertyNameToType = readMetadataTypesFromClassPropertySymbol(property);
  if (!propertyNameToType) {
    //TODO report metadata error
    return null;
  }

  const metadata = {
    callbackType: TypeMetadataParser.getTypeHolderType(propertyNameToType['callbackType']),
  };

  if (metadata.callbackType === null) {
    //TODO: report metadata error
    return null;
  }

  return metadata as LifecycleDefinitionMetadata;
};
