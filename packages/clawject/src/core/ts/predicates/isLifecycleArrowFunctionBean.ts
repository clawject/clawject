import ts from 'typescript';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { ClassPropertyWithArrowFunctionInitializer } from '../types';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { Configuration } from '../../configuration/Configuration';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { getCompilationContext } from '../../../transformer/getCompilationContext';

export const isLifecycleArrowFunctionBean = (
    configuration: Configuration,
    node: ts.Node
): node is ClassPropertyWithArrowFunctionInitializer => {
    const compilationContext = getCompilationContext();
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
            configuration.node,
        ));

        return false;
    }

    return ts.isArrowFunction(unwrapExpressionFromRoundBrackets(node.initializer));
};
