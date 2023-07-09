import ts from 'typescript';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';
import { Configuration } from '../../configuration/Configuration';

export const getConfigurationLazyExpressionValue = (configuration: Configuration): ts.Expression => {
    const decoratorMetadata = extractDecoratorMetadata(configuration.node, DecoratorKind.Lazy);

    if (decoratorMetadata === null) {
        return ts.factory.createFalse();
    }

    if (decoratorMetadata.args.length === 0) {
        return ts.factory.createTrue();
    }

    return decoratorMetadata.args[0];
};
