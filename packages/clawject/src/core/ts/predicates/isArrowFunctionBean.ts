import ts from 'typescript';
import { ClassPropertyWithArrowFunctionInitializer } from '../types';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { Configuration } from '../../configuration/Configuration';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { getCompilationContext } from '../../../transformers/getCompilationContext';

export const isArrowFunctionBean = (
    configuration: Configuration,
    node: ts.Node
): node is ClassPropertyWithArrowFunctionInitializer => {
    const compilationContext = getCompilationContext();

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

    return ts.isArrowFunction(unwrapExpressionFromRoundBrackets(node.initializer));
};
