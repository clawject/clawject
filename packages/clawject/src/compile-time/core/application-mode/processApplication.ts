import { Application, ApplicationBean } from '../application/Application';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import ts from 'typescript';
import { BeanKind } from '../bean/BeanKind';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Dependency } from '../dependency/Dependency';

export const processApplication = (application: Application, rootConfiguration: Configuration): void => {
  application.rootConfiguration = rootConfiguration;

  getBeanTypes(application, rootConfiguration);

  console.log('application', application);
};

function getBeanTypes(application: Application, rootConfiguration: Configuration): void {
  const typeChecker = getCompilationContext().typeChecker;

  const visited = new Set<ts.Symbol>();
  const stack: [Configuration, ts.Symbol][] = typeChecker.getTypeAtLocation(rootConfiguration.node).getProperties()
    .map(it => [rootConfiguration, it]);

  while (stack.length > 0) {
    const [configuration, symbol] = stack.pop()!;

    if (visited.has(symbol)) {
      continue;
    }
    visited.add(symbol);

    const propertyDeclarations = symbol.getDeclarations() ?? [];

    if (propertyDeclarations.length !== 1) {
      //TODO report compilation error
      throw new Error('Property must have exactly one declaration');
    }

    const propertyDeclaration = propertyDeclarations[0] as ts.PropertyDeclaration;

    const beanElement = configuration.beanRegister.getByNode(propertyDeclaration);
    const importElement = configuration.importRegister.getByNode(propertyDeclaration);

    if (importElement) {
      const resolvedConfiguration = importElement.resolvedConfiguration;

      if (resolvedConfiguration === null) {
        //TODO report compilation error
        throw new Error('Imported member must be a configuration');
      }

      const typeOfProperty = typeChecker.getTypeAtLocation(propertyDeclaration);
      const properties = typeOfProperty.getProperties();
      const constructorProperty = properties.find(it => it.getName() === 'constructor');

      if (!constructorProperty) {
        //TODO report compilation error
        throw new Error('Imported member must have a constructor property');
      }

      const constructSignatures = typeChecker.getTypeOfSymbol(constructorProperty).getConstructSignatures();

      if (constructSignatures.length !== 1) {
        //TODO report compilation error
        throw new Error('Imported member must have exactly one constructor');
      }

      const constructSignature = constructSignatures[0];

      constructSignature.getReturnType().getProperties().forEach(property => {
        stack.push([resolvedConfiguration, property]);
      });
    }

    if (beanElement) {
      const applicationBean = new ApplicationBean(beanElement);
      application.beans.push(applicationBean);

      const typeOfSymbol = typeChecker.getTypeOfSymbol(symbol);
      const callSignatures = typeOfSymbol.getCallSignatures();

      switch (beanElement.kind) {
      case BeanKind.FACTORY_METHOD:
      case BeanKind.CLASS_CONSTRUCTOR:
      case BeanKind.FACTORY_ARROW_FUNCTION:
      case BeanKind.LIFECYCLE_METHOD:
      case BeanKind.LIFECYCLE_ARROW_FUNCTION: {
        if (callSignatures.length !== 1) {
          //TODO report compilation error
          throw new Error('Bean must have exactly one call signature');
        }

        const callSignature = callSignatures[0];

        applicationBean.diType = beanElement.isLifecycle()
          ? DITypeBuilder.any()
          : DITypeBuilder.build(callSignature.getReturnType());

        callSignature.parameters.forEach(parameterSymbol => {
          const dependency = new Dependency();

          dependency.diType = DITypeBuilder.build(typeChecker.getTypeOfSymbol(parameterSymbol));
          dependency.parameterName = parameterSymbol.name;
          applicationBean.registerDependency(dependency);
        });
        break;
      }
      case BeanKind.VALUE_EXPRESSION:
        applicationBean.diType = DITypeBuilder.build(typeOfSymbol);
        break;
      }
    }
  }
}
