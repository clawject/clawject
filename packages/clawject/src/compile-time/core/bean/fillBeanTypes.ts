import { Configuration } from '../configuration/Configuration';
import { BeanKind } from './BeanKind';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import ts, { GetAccessorDeclaration } from 'typescript';
import { ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { CType } from '../type-system/CType';
import { Bean } from './Bean';

export const fillBeanTypes = (configuration: Configuration) => {
  configuration.beanRegister.elements.forEach(bean => {
    fillBeanType(configuration, bean);
  });
};

export function fillBeanType(configuration: Configuration, bean: Bean) {
  const compilationContext = getCompilationContext();
  const typeChecker = compilationContext.typeChecker;

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

    bean.registerType(new CType(returnType));
    return;
  }

  if (bean.kind === BeanKind.CLASS_CONSTRUCTOR) {
    const typedBeanNode = bean.node as ClassPropertyWithCallExpressionInitializer;
    const nodeType = typeChecker.getTypeAtLocation(typedBeanNode);

    let beanCType = new CType(nodeType);
    beanCType = beanCType.getPromisedType() ?? beanCType;

    const factoryProperty = beanCType.tsType.getProperty('factory');

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

    bean.registerType(new CType(callSignatureReturnType));
    return;
  }

  if (bean.kind === BeanKind.VALUE_EXPRESSION) {
    const typedBeanNode = bean.node as ts.PropertyDeclaration | GetAccessorDeclaration;
    const elementType = typeChecker.getTypeAtLocation(typedBeanNode);

    bean.registerType(new CType(elementType));
    return;
  }
}
