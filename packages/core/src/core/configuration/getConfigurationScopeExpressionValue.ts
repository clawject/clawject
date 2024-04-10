import type * as ts from 'typescript';
import { Configuration } from './Configuration';
import { Context } from '../../compilation-context/Context';
import { DecoratorProcessor } from '../decorators/DecoratorProcessor';
import { BaseDecorators } from '../decorators/BaseDecorators';

export const getConfigurationScopeExpressionValue = (element: Configuration): ts.Expression => {
  const decoratorMetadata = DecoratorProcessor.extractFirstDecoratorEntity(element.node, BaseDecorators.Scope);

  if (decoratorMetadata === null) {
    return Context.ts.factory.createStringLiteral('singleton');
  }

  return decoratorMetadata.args[0];
};
