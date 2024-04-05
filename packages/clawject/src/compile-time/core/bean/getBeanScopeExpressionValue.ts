import type * as ts from 'typescript';
import { Bean } from './Bean';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { Context } from '../../compilation-context/Context';

export const getBeanScopeExpressionValue = (bean: Bean): ts.Expression => {
  const decoratorMetadata = extractDecoratorMetadata(bean.node, DecoratorKind.Scope);

  if (decoratorMetadata === null) {
    return Context.ts.factory.createNull();
  }

  return decoratorMetadata.args[0];
};
