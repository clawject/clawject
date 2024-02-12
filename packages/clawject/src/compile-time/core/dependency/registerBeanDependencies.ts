import ts from 'typescript';
import { Configuration } from '../configuration/Configuration';
import { BeanKind } from '../bean/BeanKind';
import { Bean } from '../bean/Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { DependencyResolvingError } from '../../compilation-context/messages/errors/DependencyResolvingError';
import { Dependency } from './Dependency';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { DIType } from '../type-system/DIType';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';

export const registerBeanDependencies = (configuration: Configuration) => {
  configuration.beanRegister.elements.forEach(bean => {
    switch (bean.kind) {
    case BeanKind.CLASS_CONSTRUCTOR:
      registerBeanDependenciesFromBeanConstructSignature(bean);
      break;
    case BeanKind.FACTORY_METHOD:
    case BeanKind.LIFECYCLE_METHOD:
    case BeanKind.FACTORY_ARROW_FUNCTION:
    case BeanKind.LIFECYCLE_ARROW_FUNCTION:
      registerBeanDependenciesFromBeanCallSignature(bean);
    }
  });
};

function registerBeanDependenciesFromBeanConstructSignature(bean: Bean) {
  const typeChecker = getCompilationContext().typeChecker;
  const beanType = DITypeBuilder.getPromisedTypeOfPromise(typeChecker.getTypeAtLocation(bean.node));

  if (!beanType) {
    getCompilationContext().report(new TypeQualifyError(
      null,
      bean.node,
      bean.parentConfiguration,
    ));
    return;
  }

  const constructorProperty = beanType.getProperty('constructor');

  if (!constructorProperty) {
    getCompilationContext().report(new DependencyResolvingError(
      'Could not resolve bean dependencies. Bean must have constructor property.',
      bean.node,
      bean.parentConfiguration,
    ));
    return;
  }

  const constructorType = typeChecker.getTypeOfSymbol(constructorProperty);
  const constructSignatures = constructorType.getConstructSignatures();
  if (constructSignatures.length !== 1) {
    getCompilationContext().report(new DependencyResolvingError(
      'Could not resolve bean dependencies. Bean must have exactly one construct signature.',
      bean.node,
      bean.parentConfiguration,
    ));
    return;
  }
  const constructSignature = constructSignatures[0];

  constructSignature.parameters.forEach(parameter => {
    const parameterDeclarations = parameter.getDeclarations() ?? [];

    if (parameterDeclarations.length !== 1) {
      getCompilationContext().report(new DependencyResolvingError(
        'Could not resolve bean dependencies. Construct signature parameter must have exactly one declaration.',
        bean.node,
        bean.parentConfiguration,
      ));
      return;
    }

    const typeOfParameter = typeChecker.getTypeOfSymbol(parameter);
    const diType = DITypeBuilder.build(typeOfParameter);

    const dependency = new Dependency();
    dependency.parameterName = parameter.name;
    dependency.diType = diType;
    dependency.node = parameterDeclarations[0] as ts.ParameterDeclaration;

    bean.registerDependency(dependency);
  });
}

function registerBeanDependenciesFromBeanCallSignature(bean: Bean) {
  const typeChecker = getCompilationContext().typeChecker;
  const beanType = typeChecker.getTypeAtLocation(bean.node);
  const callSignatures = beanType.getCallSignatures();

  if (callSignatures.length !== 1) {
    getCompilationContext().report(new DependencyResolvingError(
      'Could not resolve bean dependencies. Bean must have exactly one call signature.',
      bean.node,
      bean.parentConfiguration,
    ));
    return;
  }

  const callSignature = callSignatures[0];

  callSignature.parameters.forEach(parameter => {
    const parameterDeclarations = parameter.getDeclarations() ?? [];

    if (parameterDeclarations.length !== 1) {
      getCompilationContext().report(new DependencyResolvingError(
        'Could not resolve bean dependencies. Call signature parameter must have exactly one declaration.',
        bean.node,
        bean.parentConfiguration,
      ));
      return;
    }

    const typeOfParameter = typeChecker.getTypeOfSymbol(parameter);
    const diType = DITypeBuilder.build(typeOfParameter);

    const dependency = new Dependency();
    dependency.parameterName = parameter.name;
    dependency.diType = diType;
    dependency.node = parameterDeclarations[0] as ts.ParameterDeclaration;

    bean.registerDependency(dependency);
  });
}
