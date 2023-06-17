import ts from 'typescript';

export const unwrapExpressionFromRoundBrackets = <T extends ts.Expression>(expression: T): T => {
    let unwrapped = expression;

    while (ts.isParenthesizedExpression(unwrapped)) {
        unwrapped = unwrapped.expression as T;
    }

    return unwrapped;
};
