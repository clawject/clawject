import ts from 'typescript';
import { ClassPropertyWithArrowFunctionInitializer } from '../types';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';
import { CompilationContext } from '../../../compilation-context/CompilationContext';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { Context } from '../../context/Context';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';

export const isArrowFunctionBean = (
    compilationContext: CompilationContext,
    context: Context,
    node: ts.Node
): node is ClassPropertyWithArrowFunctionInitializer => {
    if (!ts.isPropertyDeclaration(node)) {
        return false;
    }

    if (!getDecoratorsOnly(node).some(it => isDecoratorFromLibrary(it, 'Bean'))) {
        return false;
    }

    if (node.initializer === undefined) {
        compilationContext.report(new MissingInitializerError(
            null,
            node,
            context.node,
        ));

        return false;
    }

    return ts.isArrowFunction(unwrapExpressionFromRoundBrackets(node.initializer));
};
