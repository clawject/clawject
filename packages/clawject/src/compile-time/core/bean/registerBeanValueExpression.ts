import ts from 'typescript';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { getBeanLazyExpressionValue } from './getBeanLazyExpressionValue';
import { getBeanScopeExpressionValue } from './getBeanScopeExpressionValue';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';

export const registerBeanValueExpression = (
  configuration: Configuration,
  classElement: ts.PropertyDeclaration,
): void => {
  const typeChecker = getCompilationContext().typeChecker;
  const type = typeChecker.getTypeAtLocation(classElement);
  const diType = DITypeBuilder.buildForClassBean(type) ?? DITypeBuilder.build(type);

  const contextBean = new Bean({
    classMemberName: classElement.name.getText(),
    diType: diType,
    node: classElement,
    kind: BeanKind.VALUE_EXPRESSION,
    primary: extractDecoratorMetadata(classElement, DecoratorKind.Primary) !== null,
  });
  contextBean.lazyExpression.node = getBeanLazyExpressionValue(contextBean);
  contextBean.scopeExpression.node = getBeanScopeExpressionValue(contextBean);
  configuration.beanRegister.register(contextBean);
};
