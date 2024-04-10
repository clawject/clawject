import type * as ts from 'typescript';
import { Context } from '../../compilation-context/Context';
import { DecoratorProcessor } from '../decorators/DecoratorProcessor';
import { BaseDecorators } from '../decorators/BaseDecorators';

export const getLazyExpressionValue = (node: ts.Node): ts.Expression => {
  const decoratorEntity = DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.Lazy);

  if (decoratorEntity === null) {
    return Context.ts.factory.createNull();
  }

  return decoratorEntity.args[0] ?? Context.ts.factory.createTrue();
};
