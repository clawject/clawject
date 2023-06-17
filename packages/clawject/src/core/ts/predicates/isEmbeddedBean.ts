import ts from 'typescript';
import { isClassPropertyBean } from './isClassPropertyBean';
import { isExpressionBean } from './isExpressionBean';
import { CompilationContext } from '../../../compilation-context/CompilationContext';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { Context } from '../../context/Context';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';

export const isEmbeddedBean = (
    compilationContext: CompilationContext,
    context: Context,
    node: ts.Node
): node is ts.PropertyDeclaration => {
    if (isClassPropertyBean(node, compilationContext) || isExpressionBean(compilationContext, context, node)) {
        return false;
    }

    if (!ts.isPropertyDeclaration(node)) {
        return false;
    }

    if (!getDecoratorsOnly(node).some(it => isDecoratorFromLibrary(it, 'EmbeddedBean'))) {
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

    return !ts.isArrowFunction(node.initializer);
};
