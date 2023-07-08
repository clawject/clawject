import ts from 'typescript';
import { ClassPropertyWithArrowFunctionInitializer } from '../types';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { Configuration } from '../../configuration/Configuration';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';

export const isBeanFactoryArrowFunction = (
    configuration: Configuration,
    node: ts.Node
): node is ClassPropertyWithArrowFunctionInitializer => {
    const compilationContext = getCompilationContext();

    if (!ts.isPropertyDeclaration(node)) {
        return false;
    }

    const decoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Bean);

    if (decoratorMetadata === null) {
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
