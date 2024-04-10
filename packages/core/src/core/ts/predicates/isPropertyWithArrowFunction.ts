import type * as ts from 'typescript';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { Context } from '../../../compilation-context/Context';

export const isPropertyWithArrowFunction = (node: ts.Node): boolean => {
  if (!Context.ts.isPropertyDeclaration(node)) {
    return false;
  }

  if (node.initializer === undefined) {
    return false;
  }

  return Context.ts.isArrowFunction(unwrapExpressionFromRoundBrackets(node.initializer));
};
