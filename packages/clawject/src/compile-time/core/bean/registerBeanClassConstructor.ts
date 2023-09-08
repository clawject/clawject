import ts from 'typescript';
import { ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
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
import { WeakNodeHolder } from '../WeakNodeHolder';
import { getBeanQualifierValue } from './getBeanQualifierValue';

export const registerBeanClassConstructor = (
  configuration: Configuration,
  classElement: ClassPropertyWithCallExpressionInitializer,
): void => {
  const compilationContext = getCompilationContext();
  const typeChecker = compilationContext.typeChecker;
  let firstArgument = unwrapExpressionFromRoundBrackets(classElement.initializer).arguments[0];

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
    firstArgument = unwrapExpressionFromRoundBrackets(firstArgument.expression);
  }

  const nodeSourceDescriptors = getNodeSourceDescriptor(firstArgument);

  if (nodeSourceDescriptors === null) {
    compilationContext.report(new DependencyResolvingError(
      'Try to use bean factory-method instead.',
      firstArgument,
      configuration,
    ));
    return;
  }

  const classDeclarations = nodeSourceDescriptors.filter(it => ts.isClassDeclaration(it.originalNode));

  if (classDeclarations.length === 0) {
    compilationContext.report(new DependencyResolvingError(
      'Can not resolve class declaration, try to use bean factory-method instead.',
      firstArgument,
      configuration,
    ));
    return;
  }

  if (classDeclarations.length > 1) {
    compilationContext.report(new DependencyResolvingError(
      `Found ${classDeclarations.length} class declarations, try to use bean factory-method instead.`,
      firstArgument,
      configuration,
    ));
    return;
  }

  const classDeclaration = classDeclarations[0].originalNode as ts.ClassDeclaration;
  const callSignatures = typeChecker.getTypeAtLocation(classElement).getCallSignatures();

  if(callSignatures.length !== 1) {
    compilationContext.report(new DependencyResolvingError(
      'Can not resolve Bean signature, try to use factory-method Bean instead.',
      classElement,
      configuration,
    ));
    return;
  }

  const signature = callSignatures[0];
  const returnType = typeChecker.getReturnTypeOfSignature(signature);
  const bean = new Bean({
    classMemberName: classElement.name.getText(),
    node: classElement,
    kind: BeanKind.CLASS_CONSTRUCTOR,
    classDeclaration: new WeakNodeHolder<ts.ClassDeclaration>(classDeclaration),
    primary: extractDecoratorMetadata(classElement, DecoratorKind.Primary) !== null,
  });

  bean.diType = DITypeBuilder.buildForClassBean(returnType, bean) ?? DITypeBuilder.build(returnType);
  bean.lazyExpression.node = getBeanLazyExpressionValue(bean);
  bean.scopeExpression.node = getBeanScopeExpressionValue(bean);
  bean.qualifier = getBeanQualifierValue(bean);
  configuration.beanRegister.register(bean);
};
