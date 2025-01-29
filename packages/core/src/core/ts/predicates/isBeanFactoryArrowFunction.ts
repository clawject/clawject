import type ts from 'typescript';
import { ClassPropertyWithArrowFunctionInitializer } from '../types';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { Context } from '../../../compilation-context/Context';
import { DecoratorProcessor } from '../../decorators/DecoratorProcessor';
import { BaseDecorators } from '../../decorators/BaseDecorators';

export const isBeanFactoryArrowFunction = (
  node: ts.Node
): node is ClassPropertyWithArrowFunctionInitializer => {
  if (!Context.ts.isPropertyDeclaration(node)) {
    return false;
  }

  const decoratorEntity = DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.Bean);

  if (decoratorEntity === null) {
    return false;
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

  return Context.ts.isArrowFunction(unwrapExpressionFromRoundBrackets(node.initializer));
};
