import type * as ts from 'typescript';
import { ClassPropertyWithArrowFunctionInitializer } from '../types';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { Context } from '../../../compilation-context/Context';
import { DecoratorProcessor } from '../../decorators/DecoratorProcessor';
import { BaseDecorators } from '../../decorators/BaseDecorators';

export const isLifecycleArrowFunctionBean = (
  node: ts.Node
): node is ClassPropertyWithArrowFunctionInitializer => {
  if (!Context.ts.isPropertyDeclaration(node)) {
    return false;
  }

  const hasLifecycleDecorator =
    DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.PostConstruct) ||
    DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.PreDestroy);

  if (!hasLifecycleDecorator) {
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
