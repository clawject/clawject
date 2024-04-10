import type ts from 'typescript';
import { Context } from '../../../compilation-context/Context';
import { unwrapExpressionFromRoundBrackets } from './unwrapExpressionFromRoundBrackets';

export const getStaticallyKnownValue = (maybeParenthesizedExpression: ts.Expression, notStaticallyKnownToken: symbol): any => {
  const expression = unwrapExpressionFromRoundBrackets(maybeParenthesizedExpression);

  if (Context.ts.isStringLiteral(expression)) {
    return expression.text;
  }

  if (Context.ts.isNumericLiteral(expression)) {
    return parseFloat(expression.text);
  }

  if (Context.ts.isBigIntLiteral(expression)) {
    return BigInt(expression.text);
  }

  if (Context.ts.isRegularExpressionLiteral(expression)) {
    return new RegExp(expression.text);
  }

  if (Context.ts.isBooleanLiteral(expression)) {
    return expression.kind === Context.ts.SyntaxKind.TrueKeyword;
  }

  if (expression.kind === Context.ts.SyntaxKind.NullKeyword) {
    return null;
  }

  if (Context.ts.isIdentifier(expression) && expression.text === 'undefined') {
    return undefined;
  }

  if (Context.ts.isArrayLiteralExpression(expression)) {
    return expression.elements.map((element) => {
      return getStaticallyKnownValue(element, notStaticallyKnownToken);
    });
  }

  if (Context.ts.isObjectLiteralExpression(expression)) {
    const obj: Record<string | symbol, any> = {};

    for (const prop of expression.properties) {
      if (!Context.ts.isPropertyAssignment(prop)) {
        return notStaticallyKnownToken;
      } else {
        obj[prop.name.getText()] = getStaticallyKnownValue(prop.initializer, notStaticallyKnownToken);
      }
    }

    return obj;
  }

  return notStaticallyKnownToken;
};
