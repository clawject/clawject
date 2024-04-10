import { ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { getLazyExpressionValue } from './getLazyExpressionValue';
import { getBeanScopeExpressionValue } from './getBeanScopeExpressionValue';
import { getBeanQualifierValue } from './getBeanQualifierValue';
import { getExternalValueFromNode } from '../ts/utils/getExternalValueFromNode';
import { DecoratorProcessor } from '../decorators/DecoratorProcessor';
import { BaseDecorators } from '../decorators/BaseDecorators';

export const registerBeanClassConstructor = (
  configuration: Configuration,
  classElement: ClassPropertyWithCallExpressionInitializer,
): void => {
  const bean = new Bean({
    classMemberName: classElement.name.getText(),
    node: classElement,
    kind: BeanKind.CLASS_CONSTRUCTOR,
    primary: DecoratorProcessor.extractFirstDecoratorEntity(classElement, BaseDecorators.Primary) !== null,
    external: getExternalValueFromNode(classElement) ?? null,
  });

  bean.lazyExpression.value = getLazyExpressionValue(bean.node);
  bean.scopeExpression.value = getBeanScopeExpressionValue(bean);
  bean.qualifier = getBeanQualifierValue(bean);
  configuration.beanRegister.register(bean);
};
