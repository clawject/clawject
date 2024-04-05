import type * as ts from 'typescript';
import { ClassPropertyWithArrowFunctionInitializer } from '../types';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';
import { Context } from '../../../compilation-context/Context';

export const isLifecycleArrowFunctionBean = (
  node: ts.Node
): node is ClassPropertyWithArrowFunctionInitializer => {
  if (!Context.ts.isPropertyDeclaration(node)) {
    return false;
  }

  const hasLifecycleDecorator = extractDecoratorMetadata(node, DecoratorKind.PostConstruct) !== null || extractDecoratorMetadata(node, DecoratorKind.PreDestroy) !== null;

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
