import { Configuration } from '../configuration/Configuration';
import { BeanKind } from './BeanKind';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import ts, { GetAccessorDeclaration } from 'typescript';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { ClassPropertyWithCallExpressionInitializer } from '../ts/types';

export const fillBeanTypes = (configuration: Configuration) => {
  const compilationContext = getCompilationContext();
  const typeChecker = compilationContext.typeChecker;

  configuration.beanRegister.elements.forEach(bean => {
    if (bean.kind === BeanKind.FACTORY_METHOD || bean.kind === BeanKind.FACTORY_ARROW_FUNCTION) {
      const beanType = typeChecker.getTypeAtLocation(bean.node);
      const callSignatures = beanType.getCallSignatures();

      if (callSignatures.length !== 1) {
        compilationContext.report(new TypeQualifyError(
          `Could not resolve bean factory signature. Bean must have exactly 1 call signature, found ${callSignatures.length} signatures.`,
          bean.node,
          configuration,
          null,
        ));
        configuration.beanRegister.deregister(bean);
        return;
      }

      const callSignature = callSignatures[0];
      const returnType = typeChecker.getReturnTypeOfSignature(callSignature);

      bean.registerType(DITypeBuilder.build(returnType), returnType);
      return;
    }

    if (bean.kind === BeanKind.CLASS_CONSTRUCTOR) {
      const typedBeanNode = bean.node as ClassPropertyWithCallExpressionInitializer;
      const nodeType = typeChecker.getTypeAtLocation(typedBeanNode);
      const beanType = DITypeBuilder.getPromisedTypeOfPromise(nodeType) ?? nodeType;

      if (!beanType) {
        compilationContext.report(new TypeQualifyError(
          'Could not resolve bean type.',
          typedBeanNode,
          configuration,
          null,
        ));
        configuration.beanRegister.deregister(bean);
        return;
      }

      const factoryProperty = beanType.getProperty('factory');

      if (!factoryProperty) {
        compilationContext.report(new TypeQualifyError(
          'Could not resolve bean factory type, try to use factory-method Bean instead.',
          typedBeanNode,
          configuration,
          null,
        ));
        configuration.beanRegister.deregister(bean);
        return;
      }

      const factoryType = typeChecker.getTypeOfSymbol(factoryProperty);
      const callSignatures = factoryType.getCallSignatures();

      if (callSignatures.length !== 1) {
        compilationContext.report(new TypeQualifyError(
          'Could not resolve bean factory call signature, try to use factory-method Bean instead.',
          typedBeanNode,
          configuration,
          null,
        ));
        configuration.beanRegister.deregister(bean);
        return;
      }

      const callSignature = callSignatures[0];
      const callSignatureReturnType = callSignature.getReturnType();

      bean.registerType(DITypeBuilder.build(callSignatureReturnType), callSignatureReturnType);
      return;
    }

    if (bean.kind === BeanKind.VALUE_EXPRESSION) {
      const typedBeanNode = bean.node as ts.PropertyDeclaration | GetAccessorDeclaration;
      const elementType = typeChecker.getTypeAtLocation(typedBeanNode);

      bean.registerType(DITypeBuilder.build(elementType), elementType);
      return;
    }
  });
};
