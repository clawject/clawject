import ts from 'typescript';
import { isClassPropertyBean } from './isClassPropertyBean';
import { isExpressionBean } from './isExpressionBean';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { Configuration } from '../../configuration/Configuration';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';

export const isEmbeddedBean = (
    configuration: Configuration,
    node: ts.Node
): node is ts.PropertyDeclaration => {
    const compilationContext = getCompilationContext();
    if (isClassPropertyBean(node) || isExpressionBean(configuration, node)) {
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
            configuration.node,
        ));

        return false;
    }

    return !ts.isArrowFunction(node.initializer);
};
