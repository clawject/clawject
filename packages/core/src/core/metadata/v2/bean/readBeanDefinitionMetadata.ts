import type ts from 'typescript';
import { BeanDefinitionMetadata } from './BeanDefinitionMetadata';
import { TypeMetadataParser } from '../TypeMetadataParser';
import { readMetadataTypesFromClassPropertySymbol } from '../readMetadataTypesFromClassPropertySymbol';

export const readBeanDefinitionMetadata = (
  property: ts.Symbol
): BeanDefinitionMetadata | null => {
  const propertyNameToType = readMetadataTypesFromClassPropertySymbol(property);
  if (!propertyNameToType) {
    //TODO report metadata error
    return null;
  }

  const metadata = {
    primary: TypeMetadataParser.getBoolean(propertyNameToType['primary']),
    internal: TypeMetadataParser.getBoolean(propertyNameToType['internal']),
    embedded: TypeMetadataParser.getBoolean(propertyNameToType['embedded']),
    names: TypeMetadataParser.getStringArray(propertyNameToType['names']),
    rawValueType: TypeMetadataParser.getTypeHolderType(
      propertyNameToType['rawValueType']
    ),
    awaitedValueType: TypeMetadataParser.getTypeHolderType(
      propertyNameToType['awaitedValueType']
    ),
    type: TypeMetadataParser.getTypeHolderType(propertyNameToType['type']),
  };

  if (
    metadata.names === null ||
    metadata.rawValueType === null ||
    metadata.awaitedValueType === null ||
    metadata.type === null
  ) {
    //TODO: report metadata error
    return null;
  }

  return metadata as BeanDefinitionMetadata;
};
