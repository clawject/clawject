import { ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { getLazyExpressionValue } from './getLazyExpressionValue';
import { getBeanScopeExpressionValue } from './getBeanScopeExpressionValue';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { getBeanQualifierValue } from './getBeanQualifierValue';
import { getBeanConditionExpressionValue } from './getBeanConditionExpressionValue';
import { getExternalValueFromNode } from '../ts/utils/getExternalValueFromNode';

export const registerBeanClassConstructor = (
  configuration: Configuration,
  classElement: ClassPropertyWithCallExpressionInitializer,
): void => {
  const bean = new Bean({
    classMemberName: classElement.name.getText(),
    node: classElement,
    kind: BeanKind.CLASS_CONSTRUCTOR,
    primary: extractDecoratorMetadata(classElement, DecoratorKind.Primary) !== null,
    external: getExternalValueFromNode(classElement) ?? null,
  });

  bean.lazyExpression.value = getLazyExpressionValue(bean.node);
  bean.scopeExpression.value = getBeanScopeExpressionValue(bean);
  bean.conditionExpression.value = getBeanConditionExpressionValue(bean);
  bean.qualifier = getBeanQualifierValue(bean);
  configuration.beanRegister.register(bean);
};
