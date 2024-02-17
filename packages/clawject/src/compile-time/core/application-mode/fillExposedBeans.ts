import ts from 'typescript';
import { Application } from '../application/Application';
import { isExportBeansClassProperty } from '../ts/predicates/isExportBeansClassProperty';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { Dependency } from '../dependency/Dependency';
import { DependencyResolver } from '../dependency-resolver/DependencyResolver';
import { CType } from '../type-system/CType';

export const fillExposedBeans = (application: Application): void => {
  const exposedBeans = new Map<string, Dependency>();
  const dependencyToSymbol = new Map<Dependency, ts.Symbol>();

  application.rootConfiguration.node.members.forEach(member => {
    if (isExportBeansClassProperty(member)) {
      fillExposedBeansForClassElementNode(application, member, exposedBeans, dependencyToSymbol);
    }
  });

  fillApplicationExposedBeans(application, exposedBeans);
};

function fillExposedBeansForClassElementNode(application: Application, member: ts.PropertyDeclaration, exposedBeans: Map<string, Dependency>, dependencyToSymbol: Map<Dependency, ts.Symbol>): void {
  const typeChecker = getCompilationContext().typeChecker;
  const nodeType = typeChecker.getTypeAtLocation(member);
  const callSignatures = nodeType.getCallSignatures();

  if (callSignatures.length !== 1) {
    getCompilationContext().report(new TypeQualifyError(
      `Could not resolve exposed beans signature. Exposed beans property must have exactly one 1 signature, found ${callSignatures.length} signatures.`,
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

    if (exposedBeans.has(propertyName)) {
      getCompilationContext().report(new TypeQualifyError(
        'Duplicate declaration of exposed beans property.',
        propertyDeclaration,
        null,
        application,
      ));
      return;
    }

    const symbolType = typeChecker.getTypeOfSymbol(property);
    const symbolCType = new CType(symbolType);

    const dependency = new Dependency();
    dependency.node = propertyDeclaration as ts.PropertyDeclaration;
    dependency.parameterName = propertyName;
    dependency.cType = symbolCType;
    exposedBeans.set(propertyName, dependency);
    dependencyToSymbol.set(dependency, property);
  });
}

function fillApplicationExposedBeans(application: Application, exposedBeans: Map<string, Dependency>): void {
  exposedBeans.forEach((dependency, propertyName) => {
    const externalBeans = Array.from(application.beans).filter(it => it.getExternalValue());
    const resolvedDependency = DependencyResolver.resolveDependencies(dependency, externalBeans, null, application);

    application.exposedBeans.set(propertyName, resolvedDependency);
  });
}