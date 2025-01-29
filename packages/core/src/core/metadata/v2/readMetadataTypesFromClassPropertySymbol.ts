import type ts from 'typescript';
import { Context } from '../../../compilation-context/Context';

/**
 * Accepts symbol of class property taken from ts.Type (type of "data" property):
 * class A { data = 123; } and tries to read metadata property from its type.
 */
export const readMetadataTypesFromClassPropertySymbol = (property: ts.Symbol): Record<string, ts.Type> | null => {
  if (!property) {
    return null;
  }

  const typeChecker = Context.typeChecker;
  const propertyType = typeChecker.getTypeOfSymbol(property);
  const metadataProperty = propertyType.getProperty('metadata');
  if (!metadataProperty) {
    return null;
  }

  const metadataType = typeChecker.getTypeOfSymbol(metadataProperty);
  return Object.fromEntries(metadataType
    .getProperties()
    .map((it) => [it.name, typeChecker.getTypeOfSymbol(it)] as const));
};
