import ts from 'typescript';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';

export const isBeanFactoryMethod = (node: ts.Node): node is ts.MethodDeclaration => {
  return ts.isMethodDeclaration(node) && extractDecoratorMetadata(node, DecoratorKind.Bean) !== null;
};
