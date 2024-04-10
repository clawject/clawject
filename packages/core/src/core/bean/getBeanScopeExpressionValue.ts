import type * as ts from 'typescript';
import { Bean } from './Bean';
import { Context } from '../../compilation-context/Context';
import { DecoratorProcessor } from '../decorators/DecoratorProcessor';
import { BaseDecorators } from '../decorators/BaseDecorators';

export const getBeanScopeExpressionValue = (bean: Bean): ts.Expression => {
  const decoratorEntity = DecoratorProcessor.extractFirstDecoratorEntity(bean.node, BaseDecorators.Scope);

  if (decoratorEntity === null) {
    return Context.ts.factory.createNull();
  }

  return decoratorEntity.args[0];
};
