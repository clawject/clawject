import type * as ts from 'typescript';
import { Context } from '../../../compilation-context/Context';
import { DecoratorProcessor } from '../../decorators/DecoratorProcessor';
import { BaseDecorators } from '../../decorators/BaseDecorators';

export const isBeanFactoryMethod = (node: ts.Node): node is ts.MethodDeclaration => {
  return Context.ts.isMethodDeclaration(node) && DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.Bean) !== null;
};
