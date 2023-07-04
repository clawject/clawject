import ts from 'typescript';
import { DecoratorKind } from './DecoratorKind';
import { getDecoratorsOnly } from '../ts/utils/getDecoratorsOnly';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';
import { DecoratorRules } from './DecoratorRules';

export interface DecoratorMetadata {
    kind: DecoratorKind;
    args: ts.Expression[];
}

export interface ArgsCount {
    min: number;
    max: number;
}

//Assuming that everything is checked by verifyDecorators, so returning null if decorators count is wrong
export const extractDecoratorMetadata = (node: ts.Node, decorator: DecoratorKind): DecoratorMetadata | null => {
    const decorators = getDecoratorsOnly(node)
        .filter(it => isDecoratorFromLibrary(it, decorator));

    if (decorators.length === 0) {
        return null;
    }

    const decoratorNode = decorators[0];

    let args: ts.Expression[] = [];

    if (ts.isCallExpression(decoratorNode.expression)) {
        args = Array.from(decoratorNode.expression.arguments);
    }

    const argsCount = DecoratorRules.getArgumentsCount(decorator);

    if (typeof argsCount === 'number') {
        if (args.length !== argsCount) {
            return null;
        }
    } else {
        if (args.length < argsCount.min) {
            return null;
        }

        if (args.length > argsCount.max) {
            return null;
        }
    }

    return {
        kind: decorator,
        args: args,
    };
};
