import ts from 'typescript';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';

export const isPropertyWithArrowFunction = (node: ts.Node): boolean => {
    if (!ts.isPropertyDeclaration(node)) {
        return false;
    }

    if (node.initializer === undefined) {
        return false;
    }

    return ts.isArrowFunction(unwrapExpressionFromRoundBrackets(node.initializer));
};
