import ts from 'typescript';
import { MissingInitializerError } from '../../compilation-context/messages/errors/MissingInitializerError';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
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

  const typeChecker = compilationContext.typeChecker;
  const signature = typeChecker.getSignatureFromDeclaration(classElement);

  if (!signature) {
    compilationContext.report(new TypeQualifyError(
      'Can not resolve method return type.',
      classElement.name,
      configuration,
    ));
    return;
  }

  const returnType = typeChecker.getReturnTypeOfSignature(signature);

  const bean = new Bean({
    classMemberName: classElement.name.getText(),
    node: classElement,
    kind: BeanKind.FACTORY_METHOD,
    primary: extractDecoratorMetadata(classElement, DecoratorKind.Primary) !== null,
  });

  bean.diType = DITypeBuilder.buildForClassBean(returnType, bean) ?? DITypeBuilder.build(returnType);
  bean.lazyExpression.node = getBeanLazyExpressionValue(bean);
  bean.scopeExpression.node = getBeanScopeExpressionValue(bean);
  bean.conditionExpression.node = getBeanConditionExpressionValue(bean);
  bean.qualifier = getBeanQualifierValue(bean);
  configuration.beanRegister.register(bean);
};
