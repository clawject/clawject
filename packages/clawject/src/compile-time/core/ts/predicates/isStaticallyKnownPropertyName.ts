import ts from 'typescript';

export const isStaticallyKnownPropertyName = (node: ts.PropertyName): boolean => {
  //Not supporting private identifiers because decorators can't be applied to them.
  return ts.isIdentifier(node);
};
