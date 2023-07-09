import ts from 'typescript';

export const isStaticallyKnownPropertyName = (node: ts.PropertyName): boolean => {
  return ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node);
};
