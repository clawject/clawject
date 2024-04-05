import type * as ts from 'typescript';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { Context } from '../../compilation-context/Context';

export const getLazyExpressionValue = (node: ts.Node): ts.Expression => {
  const decoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Lazy);

  if (decoratorMetadata === null) {
    return Context.factory.createNull();
  }

  if (decoratorMetadata.args.length === 0) {
    return Context.factory.createTrue();
  }

  return decoratorMetadata.args[0];
};
