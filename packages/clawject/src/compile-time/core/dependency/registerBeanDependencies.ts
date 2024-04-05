import type * as ts from 'typescript';
import { Configuration } from '../configuration/Configuration';
import { BeanKind } from '../bean/BeanKind';
import { Bean } from '../bean/Bean';
import { DependencyResolvingError } from '../../compilation-context/messages/errors/DependencyResolvingError';
import { Dependency } from './Dependency';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { CType } from '../type-system/CType';
import { Logger } from '../../logger/Logger';
import { Context } from '../../compilation-context/Context';

export const registerBeanDependencies = (configuration: Configuration) => {
  configuration.beanRegister.elements.forEach(bean => {
    switch (bean.kind) {
    case BeanKind.CLASS_CONSTRUCTOR: {
      const label = `Registering bean dependencies (class constructor), file: ${bean.node.getSourceFile().fileName}, class: ${bean.node.name?.getText()}`;
      Logger.verboseDuration(label);
      registerBeanDependenciesFromBeanConstructSignature(bean);
      Logger.verboseDuration(label);
      break;
    }
    case BeanKind.FACTORY_METHOD:
    case BeanKind.LIFECYCLE_METHOD:
    case BeanKind.FACTORY_ARROW_FUNCTION:
    case BeanKind.LIFECYCLE_ARROW_FUNCTION: {
      const label = `Registering bean dependencies (call signature), file: ${bean.node.getSourceFile().fileName}, class: ${bean.node.name?.getText()}`;
      Logger.verboseDuration(label);
      registerBeanDependenciesFromBeanCallSignature(bean);
      Logger.verboseDuration(label);
      break;
    }
    }
  });
};

function registerBeanDependenciesFromBeanConstructSignature(bean: Bean) {
  const nodeType = Context.typeChecker.getTypeAtLocation(bean.node);
  let beanType = new CType(nodeType);
  beanType = beanType.getPromisedType() ?? beanType;

  if (!beanType) {
    Context.report(new TypeQualifyError(
      null,
      bean.node,
      bean.parentConfiguration,
      null,
    ));
    return;
  }

  const constructorProperty = beanType.tsType.getProperty('constructor');

  if (!constructorProperty) {
    Context.report(new DependencyResolvingError(
      'Could not resolve bean dependencies. Bean must have constructor property.',
      bean.node,
      bean.parentConfiguration,
      null,
    ));
    return;
  }

  const constructorType = Context.typeChecker.getTypeOfSymbol(constructorProperty);
  const constructSignatures = constructorType.getConstructSignatures();
  if (constructSignatures.length !== 1) {
    Context.report(new DependencyResolvingError(
      'Could not resolve bean dependencies. Bean must have exactly one construct signature.',
      bean.node,
      bean.parentConfiguration,
      null,
    ));
    return;
  }
  const constructSignature = constructSignatures[0];

  constructSignature.parameters.forEach(parameter => {
    const parameterDeclarations = parameter.getDeclarations() ?? [];

    if (parameterDeclarations.length !== 1) {
      Context.report(new DependencyResolvingError(
        'Could not resolve bean dependencies. Construct signature parameter must have exactly one declaration.',
        bean.node,
        bean.parentConfiguration,
        null,
      ));
      return;
    }

    const dependency = new Dependency();
    dependency.parameterName = parameter.name;
    dependency.cType = new CType(getResolvedTypeFromParameterSymbol(parameter));
    dependency.node = parameterDeclarations[0] as ts.ParameterDeclaration;

    bean.registerDependency(dependency);
  });
}

function registerBeanDependenciesFromBeanCallSignature(bean: Bean) {
  const typeChecker = Context.typeChecker;
  const beanType = typeChecker.getTypeAtLocation(bean.node);
  const callSignatures = beanType.getCallSignatures();

  if (callSignatures.length !== 1) {
    Context.report(new DependencyResolvingError(
      'Could not resolve bean dependencies. Bean must have exactly one call signature.',
      bean.node,
      bean.parentConfiguration,
      null,
    ));
    return;
  }

  const callSignature = callSignatures[0];

  callSignature.parameters.forEach(parameter => {
    const parameterDeclarations = parameter.getDeclarations() ?? [];

    if (parameterDeclarations.length !== 1) {
      Context.report(new DependencyResolvingError(
        'Could not resolve bean dependencies. Call signature parameter must have exactly one declaration.',
        bean.node,
        bean.parentConfiguration,
        null,
      ));
      return;
    }

    const dependency = new Dependency();
    dependency.parameterName = parameter.name;
    dependency.cType = new CType(getResolvedTypeFromParameterSymbol(parameter));
    dependency.node = parameterDeclarations[0] as ts.ParameterDeclaration;

    bean.registerDependency(dependency);
  });
}

function getResolvedTypeFromParameterSymbol(parameter: ts.Symbol): ts.Type {
  let type = Context.typeChecker.getTypeOfSymbol(parameter);

  if (type.isTypeParameter()) {
    type = type.getDefault() ?? type.getConstraint() ?? type;
  }

  return type;
}
