import type * as ts from 'typescript';
import { createBoolean } from '../ts/utils/createBoolean';
import { Configuration } from './Configuration';
import { DecoratorProcessor } from '../decorators/DecoratorProcessor';
import { BaseDecorators } from '../decorators/BaseDecorators';

export const getConfigurationLazyExpressionValue = (element: Configuration): ts.Expression => {
  const decoratorMetadata = DecoratorProcessor.extractFirstDecoratorEntity(element.node, BaseDecorators.Lazy);

  if (decoratorMetadata === null) {
    return createBoolean(false);
  }

  if (decoratorMetadata.args.length === 0) {
    return createBoolean(true);
  }

  return decoratorMetadata.args[0];
};
