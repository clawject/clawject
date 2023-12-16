import { Configuration } from '../configuration/Configuration';
import { BeanKind } from './BeanKind';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import ts, { GetAccessorDeclaration } from 'typescript';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { ClassPropertyWithArrowFunctionInitializer, ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { DependencyResolvingError } from '../../compilation-context/messages/errors/DependencyResolvingError';

export const fillBeanTypes = (configuration: Configuration) => {
  const compilationContext = getCompilationContext();
  const typeChecker = compilationContext.typeChecker;

  configuration.beanRegister.elements.forEach(bean => {
    if (bean.kind === BeanKind.FACTORY_METHOD) {
      const typedBeanNode = bean.node as ts.MethodDeclaration;
      const signature = typeChecker.getSignatureFromDeclaration(typedBeanNode);
      if (!signature) {
        compilationContext.report(new TypeQualifyError(
          'Can not resolve method return type.',
          bean.node.name,
          configuration,
        ));
        return;
      }

      const returnType = typeChecker.getReturnTypeOfSignature(signature);

      bean.registerType(DITypeBuilder.build(returnType));
      return;
    }

    if (bean.kind === BeanKind.CLASS_CONSTRUCTOR) {
      const typedBeanNode = bean.node as ClassPropertyWithCallExpressionInitializer;
      const callSignatures = typeChecker.getTypeAtLocation(typedBeanNode).getCallSignatures();
      if (callSignatures.length !== 1) {
        compilationContext.report(new DependencyResolvingError(
          'Can not resolve Bean signature, try to use factory-method Bean instead.',
          typedBeanNode,
          configuration,
        ));
        return;
      }
      const callSignatureReturnType = callSignatures[0].getReturnType();

      bean.registerType(DITypeBuilder.build(callSignatureReturnType));
      return;
    }

    if (bean.kind === BeanKind.FACTORY_ARROW_FUNCTION) {
      const typedBeanNode = bean.node as ClassPropertyWithArrowFunctionInitializer;
      const signature = typeChecker.getSignatureFromDeclaration(typedBeanNode.initializer);
      if (!signature) {
        compilationContext.report(new TypeQualifyError(
          'Can not resolve function return type.',
          typedBeanNode.initializer,
          configuration,
        ));
        return;
      }

      const returnType = typeChecker.getReturnTypeOfSignature(signature);

      bean.registerType(DITypeBuilder.build(returnType));
      return;
    }

    if (bean.kind === BeanKind.VALUE_EXPRESSION) {
      const typedBeanNode = bean.node as ts.PropertyDeclaration | GetAccessorDeclaration;
      const elementType = typeChecker.getTypeAtLocation(typedBeanNode);

      bean.registerType(DITypeBuilder.build(elementType));
      return;
    }
  });
};
