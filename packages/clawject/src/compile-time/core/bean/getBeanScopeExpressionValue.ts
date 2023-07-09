import ts from 'typescript';
import { Bean } from './Bean';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';

export const getBeanScopeExpressionValue = (bean: Bean): ts.Expression => {
  const decoratorMetadata = extractDecoratorMetadata(bean.node, DecoratorKind.Scope);

  if (decoratorMetadata === null) {
    return ts.factory.createStringLiteral('singleton');
  }

  return decoratorMetadata.args[0];
};
