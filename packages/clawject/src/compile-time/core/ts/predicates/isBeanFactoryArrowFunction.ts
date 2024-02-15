import ts from 'typescript';
import { ClassPropertyWithArrowFunctionInitializer } from '../types';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';

export const isBeanFactoryArrowFunction = (
  node: ts.Node
): node is ClassPropertyWithArrowFunctionInitializer => {
  if (!ts.isPropertyDeclaration(node)) {
    return false;
  }

  const decoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Bean);

  if (decoratorMetadata === null) {
    return false;
  }

  if (node.initializer === undefined) {
    getCompilationContext().report(new MissingInitializerError(
      null,
      node,
      null,
      null,
    ));
    return false;
  }

  return ts.isArrowFunction(unwrapExpressionFromRoundBrackets(node.initializer));
};
