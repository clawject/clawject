import type * as ts from 'typescript';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { Configuration } from './Configuration';
import { Context } from '../../compilation-context/Context';

export const getConfigurationScopeExpressionValue = (element: Configuration): ts.Expression => {
  const decoratorMetadata = extractDecoratorMetadata(element.node, DecoratorKind.Scope);

  if (decoratorMetadata === null) {
    return Context.ts.factory.createStringLiteral('singleton');
  }

  return decoratorMetadata.args[0];
};
