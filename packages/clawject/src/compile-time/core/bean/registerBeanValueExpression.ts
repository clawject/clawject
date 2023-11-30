import ts, { GetAccessorDeclaration } from 'typescript';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { getBeanLazyExpressionValue } from './getBeanLazyExpressionValue';
import { getBeanScopeExpressionValue } from './getBeanScopeExpressionValue';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { getBeanQualifierValue } from './getBeanQualifierValue';
import { getBeanConditionExpressionValue } from './getBeanConditionExpressionValue';
import { DITypeBuilder } from '../type-system/DITypeBuilder';

export const registerBeanValueExpression = (
  configuration: Configuration,
  classElement: ts.PropertyDeclaration | GetAccessorDeclaration,
): void => {
  const typeChecker = getCompilationContext().typeChecker;
  const type = typeChecker.getTypeAtLocation(classElement);

  const bean = new Bean({
    classMemberName: classElement.name.getText(),
    node: classElement,
    kind: BeanKind.VALUE_EXPRESSION,
    primary: extractDecoratorMetadata(classElement, DecoratorKind.Primary) !== null,
  });

  bean.diType = DITypeBuilder.build(type);
  bean.lazyExpression.node = getBeanLazyExpressionValue(bean);
  bean.scopeExpression.node = getBeanScopeExpressionValue(bean);
  bean.conditionExpression.node = getBeanConditionExpressionValue(bean);
  bean.qualifier = getBeanQualifierValue(bean);
  configuration.beanRegister.register(bean);
};
