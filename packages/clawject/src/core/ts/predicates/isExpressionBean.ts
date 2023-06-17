import ts, { PropertyDeclaration } from 'typescript';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';
import { isClassPropertyBean } from './isClassPropertyBean';
import { CompilationContext } from '../../../compilation-context/CompilationContext';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { Context } from '../../context/Context';

export const isExpressionBean = (
    compilationContext: CompilationContext,
    context: Context,
    node: ts.Node
): node is PropertyDeclaration => {
    if (isClassPropertyBean(node, compilationContext)) {
        return false;
    }

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

    return !ts.isArrowFunction(node.initializer);
};
