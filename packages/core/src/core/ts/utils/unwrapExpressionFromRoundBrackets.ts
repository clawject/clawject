import type ts from 'typescript';
import { Context } from '../../../compilation-context/Context';

export const unwrapExpressionFromRoundBrackets = <T extends ts.Expression>(expression: T): T => {
  let unwrapped = expression;

  while (Context.ts.isParenthesizedExpression(unwrapped)) {
    unwrapped = unwrapped.expression as T;
  }

  return unwrapped;
};
