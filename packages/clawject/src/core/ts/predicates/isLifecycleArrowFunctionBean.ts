import ts from 'typescript';
import { CompilationContext } from '../../../compilation-context/CompilationContext';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { ClassPropertyWithArrowFunctionInitializer } from '../types';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { Context } from '../../context/Context';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';

export const isLifecycleArrowFunctionBean = (
    compilationContext: CompilationContext,
    context: Context,
    node: ts.Node
): node is ClassPropertyWithArrowFunctionInitializer => {
    if (!ts.isPropertyDeclaration(node)) {
        return false;
    }

    const decorators = getDecoratorsOnly(node);
    const hasLifecycleDecorator = decorators.some(it => {
        return isDecoratorFromLibrary(it, 'PostConstruct') || isDecoratorFromLibrary(it, 'BeforeDestruct');
    });

    if (!hasLifecycleDecorator) {
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
