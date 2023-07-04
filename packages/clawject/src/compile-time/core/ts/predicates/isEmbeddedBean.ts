import ts from 'typescript';
import { MissingInitializerError } from '../../../compilation-context/messages/errors/MissingInitializerError';
import { Configuration } from '../../configuration/Configuration';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';

export const isEmbeddedBean = (
    configuration: Configuration,
    node: ts.Node
): node is ts.PropertyDeclaration => {
    const compilationContext = getCompilationContext();

    if (!ts.isPropertyDeclaration(node)) {
        return false;
    }

    const decoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.EmbeddedBean);

    if (decoratorMetadata ===  null) {
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
