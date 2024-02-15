import ts from 'typescript';
import { Application } from '../application/Application';
import { isExportBeansClassProperty } from '../ts/predicates/isExportBeansClassProperty';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { Dependency } from '../dependency/Dependency';
import { DependencyResolver } from '../dependency-resolver/DependencyResolver';

export const fillExposedBeans = (application: Application): void => {
  const exposedBeans = new Map<string, Dependency>();
  const dependencyToSymbols = new Map<Dependency, ts.Symbol[]>();

  application.rootConfiguration.node.members.forEach(member => {
    if (isExportBeansClassProperty(member)) {
      fillExposedBeansForClassElementNode(application, member, exposedBeans, dependencyToSymbols);
    }
  });

  fillApplicationExposedBeans(application, exposedBeans);
};

function fillExposedBeansForClassElementNode(application: Application, member: ts.PropertyDeclaration, exposedBeans: Map<string, Dependency>, dependencyToSymbols: Map<Dependency, ts.Symbol[]>): void {
  const typeChecker = getCompilationContext().typeChecker;
  const nodeType = typeChecker.getTypeAtLocation(member);
  const callSignatures = nodeType.getCallSignatures();

  if (callSignatures.length !== 1) {
    getCompilationContext().report(new TypeQualifyError(
      `Could not resolve exported beans signature. Exported beans property must have exactly one 1 signature, found ${callSignatures.length} signatures.`,
      member,
      null,
      application,
    ));
    return;
  }

  const callSignature = callSignatures[0];

  const returnType = typeChecker.getReturnTypeOfSignature(callSignature);
  const properties = returnType.getProperties();

  const beansProperty = properties.find(it => it.getName() === 'beans');

  if (!beansProperty) {
    getCompilationContext().report(new TypeQualifyError(
      'Could not resolve export beans type.',
      member,
      null,
      application,
    ));
    return;
  }

  const beansType = typeChecker.getTypeOfSymbol(beansProperty);
  beansType.getProperties().forEach(property => {
    const propertyName = property.getName();
    const propertyDeclaration = property.valueDeclaration;

    if (!propertyDeclaration) {
      getCompilationContext().report(new TypeQualifyError(
        'Could not resolve export beans type.',
        member,
        null,
        application,
      ));
      return;
    }

    const symbolType = typeChecker.getTypeOfSymbol(property);
    const symbolDIType = DITypeBuilder.build(symbolType);

    let existedDependency = exposedBeans.get(propertyName);

    if (!existedDependency) {
      existedDependency = new Dependency();
      existedDependency.node = propertyDeclaration as ts.PropertyDeclaration;
      existedDependency.parameterName = propertyName;
      existedDependency.diType = symbolDIType;
      exposedBeans.set(propertyName, existedDependency);
      dependencyToSymbols.set(existedDependency, [property]);
    } else {
      existedDependency.diType = DITypeBuilder.buildSyntheticIntersectionOrPlain([existedDependency.diType, symbolDIType]);
      dependencyToSymbols.get(existedDependency)?.push(property);
    }
  });
}

function fillApplicationExposedBeans(application: Application, exposedBeans: Map<string, Dependency>): void {
  exposedBeans.forEach((dependency, propertyName) => {
    const externalBeans = Array.from(application.beans).filter(it => it.getExternalValue());
    const resolvedDependency = DependencyResolver.resolveDependencies(dependency, externalBeans, null, application);

    application.exposedBeans.set(propertyName, resolvedDependency);
  });
}
