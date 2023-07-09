import ts, { factory } from 'typescript';
import { Bean } from './Bean';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';

export const getBeanLazyExpressionValue = (element: Bean): ts.Expression => {
  const decoratorMetadata = extractDecoratorMetadata(element.node, DecoratorKind.Lazy);

  if (decoratorMetadata === null) {
    return factory.createNull();
  }

  if (decoratorMetadata.args.length === 0) {
    return ts.factory.createTrue();
  }

  return decoratorMetadata.args[0];
};
