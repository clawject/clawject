import ts, { GetAccessorDeclaration } from 'typescript';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { getBeanLazyExpressionValue } from './getBeanLazyExpressionValue';
import { getBeanScopeExpressionValue } from './getBeanScopeExpressionValue';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { getBeanQualifierValue } from './getBeanQualifierValue';
import { getBeanConditionExpressionValue } from './getBeanConditionExpressionValue';
import { getExternalValueFromNode } from '../ts/utils/getExternalValueFromNode';

export const registerBeanValueExpression = (
  configuration: Configuration,
  classElement: ts.PropertyDeclaration | GetAccessorDeclaration,
): void => {
  const bean = new Bean({
    classMemberName: classElement.name.getText(),
    node: classElement,
    kind: BeanKind.VALUE_EXPRESSION,
    primary: extractDecoratorMetadata(classElement, DecoratorKind.Primary) !== null,
    external: getExternalValueFromNode(classElement) ?? null,
  });

  bean.lazyExpression.value = getBeanLazyExpressionValue(bean);
  bean.scopeExpression.value = getBeanScopeExpressionValue(bean);
  bean.conditionExpression.value = getBeanConditionExpressionValue(bean);
  bean.qualifier = getBeanQualifierValue(bean);
  configuration.beanRegister.register(bean);
};
