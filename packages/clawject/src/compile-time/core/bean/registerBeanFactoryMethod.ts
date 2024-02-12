import ts from 'typescript';
import { MissingInitializerError } from '../../compilation-context/messages/errors/MissingInitializerError';
import { Configuration } from '../configuration/Configuration';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { getBeanLazyExpressionValue } from './getBeanLazyExpressionValue';
import { getBeanScopeExpressionValue } from './getBeanScopeExpressionValue';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { getBeanQualifierValue } from './getBeanQualifierValue';
import { getBeanConditionExpressionValue } from './getBeanConditionExpressionValue';
import { getExternalValueFromNode } from '../ts/utils/getExternalValueFromNode';

export const registerBeanFactoryMethod = (
  configuration: Configuration,
  classElement: ts.MethodDeclaration,
): void => {
  const compilationContext = getCompilationContext();
  if (classElement.body === undefined) {
    compilationContext.report(new MissingInitializerError(
      'Method Bean should have a body.',
      classElement.name,
      configuration,
    ));
    return;
  }

  const bean = new Bean({
    classMemberName: classElement.name.getText(),
    node: classElement,
    kind: BeanKind.FACTORY_METHOD,
    primary: extractDecoratorMetadata(classElement, DecoratorKind.Primary) !== null,
    external: getExternalValueFromNode(classElement) ?? null,
  });

  bean.lazyExpression.value = getBeanLazyExpressionValue(bean);
  bean.scopeExpression.value = getBeanScopeExpressionValue(bean);
  bean.conditionExpression.value = getBeanConditionExpressionValue(bean);
  bean.qualifier = getBeanQualifierValue(bean);
  configuration.beanRegister.register(bean);
};
