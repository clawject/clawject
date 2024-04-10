import type * as ts from 'typescript';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { Context } from '../../../compilation-context/Context';
import { DecoratorProcessor } from '../../decorators/DecoratorProcessor';
import { BaseDecorators } from '../../decorators/BaseDecorators';

export const isBeanValueExpression = (
  node: ts.Node
): node is ts.PropertyDeclaration | ts.GetAccessorDeclaration => {
  if (!Context.ts.isPropertyDeclaration(node) && !Context.ts.isGetAccessorDeclaration(node)) {
    return false;
  }

  const decoratorEntity = DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.Bean);

  if (decoratorEntity === null) {
    return false;
  }

  if (Context.ts.isGetAccessorDeclaration(node)) {
    return true;
  }

  if (node.initializer === undefined) {
    Context.report(new MissingInitializerError(
      null,
      node,
      null,
      null,
    ));
    return false;
  }

  return !Context.ts.isArrowFunction(node.initializer);
};
