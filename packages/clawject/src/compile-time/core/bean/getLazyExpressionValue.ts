import ts, { factory } from 'typescript';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';

export const getLazyExpressionValue = (node: ts.Node): ts.Expression => {
  const decoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Lazy);

  if (decoratorMetadata === null) {
    return factory.createNull();
  }

  if (decoratorMetadata.args.length === 0) {
    return ts.factory.createTrue();
  }

  return decoratorMetadata.args[0];
};
