import ts, { PropertyDeclaration } from 'typescript';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';
import { isClassPropertyBean } from './isClassPropertyBean';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { Configuration } from '../../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';

export const isExpressionBean = (
    configuration: Configuration,
    node: ts.Node
): node is PropertyDeclaration => {
    const compilationContext = getCompilationContext();

    if (isClassPropertyBean(node)) {
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
            configuration.node,
        ));

        return false;
    }

    return !ts.isArrowFunction(node.initializer);
};
