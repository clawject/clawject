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

export const registerBeanClassConstructor = (
  configuration: Configuration,
  classElement: ClassPropertyWithCallExpressionInitializer,
): void => {
  const compilationContext = getCompilationContext();

  let firstArgument = unwrapExpressionFromRoundBrackets(classElement.initializer).arguments[0];

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

  const typeChecker = compilationContext.typeChecker;
  const classDeclaration = classDeclarations[0].originalNode as ts.ClassDeclaration;
  let tsType: ts.Type;

  const typeArgumentsLength = classElement.initializer.typeArguments?.length ?? 0;

  if (typeArgumentsLength === 1) {
    tsType = typeChecker.getTypeAtLocation(classElement.initializer.typeArguments![0]);
  } else {
    tsType = typeChecker.getTypeAtLocation(classDeclaration);
  }

  const diType = DITypeBuilder.buildForClassBean(tsType) ?? DITypeBuilder.build(tsType);

  const contextBean = new Bean({
    classMemberName: classElement.name.getText(),
    diType: diType,
    node: classElement,
    kind: BeanKind.CLASS_CONSTRUCTOR,
    classDeclaration: new WeakNodeHolder<ts.ClassDeclaration>(classDeclaration),
    primary: extractDecoratorMetadata(classElement, DecoratorKind.Primary) !== null,
  });
  contextBean.lazyExpression.node = getBeanLazyExpressionValue(contextBean);
  contextBean.scopeExpression.node = getBeanScopeExpressionValue(contextBean);
  configuration.beanRegister.register(contextBean);
};
