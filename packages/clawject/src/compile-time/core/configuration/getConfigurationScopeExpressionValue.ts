import ts from 'typescript';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { Configuration } from './Configuration';

export const getConfigurationScopeExpressionValue = (element: Configuration): ts.Expression => {
  const decoratorMetadata = extractDecoratorMetadata(element.node, DecoratorKind.Scope);

  if (decoratorMetadata === null) {
    return ts.factory.createStringLiteral('singleton');
  }

  return decoratorMetadata.args[0];
};
