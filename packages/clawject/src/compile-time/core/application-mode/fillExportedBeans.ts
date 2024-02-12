import ts from 'typescript';
import { Application } from '../application/Application';
import { isExportBeansClassProperty } from '../ts/predicates/isExportBeansClassProperty';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { Dependency } from '../dependency/Dependency';
import { DependencyResolver } from '../dependency-resolver/DependencyResolver';

export const fillExportedBeans = (application: Application): void => {
  const exportedBeans = new Map<string, Dependency>();

  application.rootConfiguration.node.members.forEach(member => {
    if (isExportBeansClassProperty(member)) {
      fillExportedBeansForClassElementNode(application, member, exportedBeans);
    }
  });

  fillApplicationExportedBeans(application, exportedBeans);
};

function fillExportedBeansForClassElementNode(application: Application, member: ts.PropertyDeclaration, exportedBeans: Map<string, Dependency>): void {
  const typeChecker = getCompilationContext().typeChecker;
  const nodeType = typeChecker.getTypeAtLocation(member);
  const callSignatures = nodeType.getCallSignatures();

  if (callSignatures.length !== 1) {
    getCompilationContext().report(new TypeQualifyError(
      `Could not resolve exported beans signature. Exported beans property must have exactly one 1 signature, found ${callSignatures.length} signatures.`,
      member,
      application.rootConfiguration,
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
      application.rootConfiguration,
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
        application.rootConfiguration,
      ));
      return;
    }

    const symbolType = typeChecker.getTypeOfSymbol(property);
    const symbolDIType = DITypeBuilder.build(symbolType);

    let existedDependency = exportedBeans.get(propertyName);

    if (!existedDependency) {
      existedDependency = new Dependency();
      existedDependency.node = propertyDeclaration as ts.PropertyDeclaration;
      existedDependency.parameterName = propertyName;
      existedDependency.diType = symbolDIType;
      exportedBeans.set(propertyName, existedDependency);
    } else {
      existedDependency.diType = DITypeBuilder.buildSyntheticIntersectionOrPlain([existedDependency.diType, symbolDIType]);
    }
  });
}

function fillApplicationExportedBeans(application: Application, exportedBeans: Map<string, Dependency>): void {
  exportedBeans.forEach((dependency, propertyName) => {
    const externalBeans = Array.from(application.beans).filter(it => it.getExternalValue());
    const resolvedDependency = DependencyResolver.resolveDependencies(dependency, externalBeans, null);

    application.exportedBeans.set(propertyName, resolvedDependency);
  });
}
