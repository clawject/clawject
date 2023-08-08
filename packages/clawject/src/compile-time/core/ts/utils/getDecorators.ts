import ts from 'typescript';

export const getDecorators = (node: ts.Node): ts.Decorator[] => {
  const decorators = ts.canHaveDecorators(node) ? [...(ts.getDecorators(node) ?? [])] : [];

  return decorators;
};
