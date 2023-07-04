import ts from 'typescript';
import { ClassPropertyWithArrowFunctionInitializer } from '../types';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';

export const isLifecycleArrowFunctionBean = (
    node: ts.Node
): node is ClassPropertyWithArrowFunctionInitializer => {
    const compilationContext = getCompilationContext();
    if (!ts.isPropertyDeclaration(node)) {
        return false;
    }

    const hasLifecycleDecorator = extractDecoratorMetadata(node, DecoratorKind.PostConstruct) !== null || extractDecoratorMetadata(node, DecoratorKind.BeforeDestruct) !== null;

    if (!hasLifecycleDecorator) {
        return false;
    }

    if (node.initializer === undefined) {
        compilationContext.report(new MissingInitializerError(
            null,
            node,
            null,
        ));

        return false;
    }

    return ts.isArrowFunction(unwrapExpressionFromRoundBrackets(node.initializer));
};
