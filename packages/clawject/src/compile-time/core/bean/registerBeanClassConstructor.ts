import ts from 'typescript';
import { ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { unwrapExpressionFromRoundBrackets } from '../ts/utils/unwrapExpressionFromRoundBrackets';
import { getNodeSourceDescriptor } from '../ts/utils/getNodeSourceDescriptor';
import { DependencyResolvingError } from '../../compilation-context/messages/errors/DependencyResolvingError';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { getBeanLazyExpressionValue } from './getBeanLazyExpressionValue';
import { getBeanScopeExpressionValue } from './getBeanScopeExpressionValue';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { getBeanQualifierValue } from './getBeanQualifierValue';
import { getBeanConditionExpressionValue } from './getBeanConditionExpressionValue';
import { DITypeBuilder } from '../type-system/DITypeBuilder';

export const registerBeanClassConstructor = (
  configuration: Configuration,
  classElement: ClassPropertyWithCallExpressionInitializer,
): void => {
  const compilationContext = getCompilationContext();
  const typeChecker = compilationContext.typeChecker;
  let firstArgument: ts.Expression | undefined = unwrapExpressionFromRoundBrackets(classElement.initializer).arguments[0];
  firstArgument && (firstArgument = unwrapExpressionFromRoundBrackets(firstArgument));

  if (!firstArgument) {
    compilationContext.report(new DependencyResolvingError(
      'Missing class constructor argument.',
      classElement.initializer,
      configuration,
    ));
    return;
  }

  if (ts.isExpressionWithTypeArguments(firstArgument)) {
    firstArgument = firstArgument.expression;
  }

  const callSignaturesNew = typeChecker.getTypeAtLocation(classElement).getCallSignatures();

  if (callSignaturesNew.length !== 1) {
    compilationContext.report(new DependencyResolvingError(
      'Can not resolve Bean signature, try to use factory-method Bean instead.',
      classElement,
      configuration,
    ));
    return;
  }
  const callSignatureReturnType = callSignaturesNew[0].getReturnType();
  const diType = DITypeBuilder.build(callSignatureReturnType);

  const nodeSourceDescriptors = getNodeSourceDescriptor(firstArgument);

  if (nodeSourceDescriptors === null) {
    compilationContext.report(new DependencyResolvingError(
      'Try to use bean factory-method instead.',
      firstArgument,
      configuration,
    ));
    return;
  }

  const bean = new Bean({
    classMemberName: classElement.name.getText(),
    node: classElement,
    kind: BeanKind.CLASS_CONSTRUCTOR,
    primary: extractDecoratorMetadata(classElement, DecoratorKind.Primary) !== null,
  });

  bean.diType = diType;
  bean.lazyExpression.node = getBeanLazyExpressionValue(bean);
  bean.scopeExpression.node = getBeanScopeExpressionValue(bean);
  bean.conditionExpression.node = getBeanConditionExpressionValue(bean);
  bean.qualifier = getBeanQualifierValue(bean);
  configuration.beanRegister.register(bean);
};
