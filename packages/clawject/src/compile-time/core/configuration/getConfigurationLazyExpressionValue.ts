import ts from 'typescript';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { createBoolean } from '../ts/utils/createBoolean';
import { Configuration } from './Configuration';

export const getConfigurationLazyExpressionValue = (element: Configuration): ts.Expression => {
  const decoratorMetadata = extractDecoratorMetadata(element.node, DecoratorKind.Lazy);

  if (decoratorMetadata === null) {
    return createBoolean(false);
  }

  if (decoratorMetadata.args.length === 0) {
    return createBoolean(true);
  }

  return decoratorMetadata.args[0];
};
