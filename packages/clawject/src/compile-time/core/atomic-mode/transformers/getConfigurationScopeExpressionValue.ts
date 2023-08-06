import ts from 'typescript';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';
import { Configuration } from '../../configuration/Configuration';

export const getConfigurationScopeExpressionValue = (configuration: Configuration): ts.Expression => {
  const decoratorMetadata = extractDecoratorMetadata(configuration.node, DecoratorKind.Scope);

  if (decoratorMetadata === null) {
    return ts.factory.createStringLiteral('singleton');
  }

  return decoratorMetadata.args[0];
};
