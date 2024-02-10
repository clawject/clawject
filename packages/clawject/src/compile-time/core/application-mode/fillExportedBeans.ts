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

  const awaitedType = DITypeBuilder.getAwaitedType(nodeType);

  if (awaitedType === null) {
    getCompilationContext().report(new TypeQualifyError(
      'Could not resolve export beans type.',
      member,
      application.rootConfiguration,
    ));
    return;
  }

  const properties = awaitedType.getProperties();

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
      existedDependency.diType = DITypeBuilder.buildSyntheticIntersectionOrPlain([existedDependency.diType, DITypeBuilder.build(typeChecker.getTypeOfSymbol(property))]);
    }
  });
}

function fillApplicationExportedBeans(application: Application, exportedBeans: Map<string, Dependency>): void {
  exportedBeans.forEach((dependency, propertyName) => {
    const resolvedDependency = DependencyResolver.resolveDependencies(dependency, Array.from(application.beans), null);

    application.exportedBeans.set(propertyName, resolvedDependency);
  });
}
