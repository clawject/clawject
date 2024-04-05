import type * as ts from 'typescript';
import { Bean } from './Bean';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';

export const getBeanConditionExpressionValue = (bean: Bean): ts.Expression | null => {
  return extractDecoratorMetadata(bean.node, DecoratorKind.Conditional)?.args[0] ?? null;
};
