import type * as ts from 'typescript';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { Context } from '../../../compilation-context/Context';

export const isBeanFactoryMethod = (node: ts.Node): node is ts.MethodDeclaration => {
  return Context.ts.isMethodDeclaration(node) && extractDecoratorMetadata(node, DecoratorKind.Bean) !== null;
};
