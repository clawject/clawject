import { Configuration } from '../configuration/Configuration';
import { isImportClassProperty } from '../ts/predicates/isImportClassProperty';
import { Import } from './Import';
import ts from 'typescript';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { processConfigurationOrApplicationClass } from '../application-mode/processConfigurationOrApplicationClass';
import { ConfigurationImportError } from '../../compilation-context/messages/errors/ConfigurationImportError';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';

export const registerImports = (configuration: Configuration): void => {
  configuration.node.members.forEach(member => {
    if (isImportClassProperty(member)) {
      registerImportForClassElementNode(configuration, member);
    }
  });
};

export function registerImportForClassElementNode(configuration: Configuration, member: ts.PropertyDeclaration): void {
  const typeChecker = getCompilationContext().typeChecker;
  const importType = DITypeBuilder.getAwaitedType(typeChecker.getTypeAtLocation(member));

  if (!importType) {
    getCompilationContext().report(new TypeQualifyError(
      'Could not resolve import type.',
      member,
      configuration,
    ));
    return;
  }

  const properties = importType.getProperties();
  const constructor = properties.find(it => it.getName() === 'constructor');

  if (!constructor) {
    getCompilationContext().report(new ConfigurationImportError(
      'Import must have a constructor property.',
      member,
      configuration,
    ));
    return;
  }

  const constructorType = typeChecker.getTypeOfSymbol(constructor);
  const constructSignatures = constructorType.getConstructSignatures();

  if (constructSignatures.length === 0) {
    getCompilationContext().report(new ConfigurationImportError(
      'No imported class construct signatures found.',
      member,
      configuration,
    ));
    return;
  }

  if (constructSignatures.length !== 1) {
    getCompilationContext().report(new ConfigurationImportError(
      'Imported class mush have only 1 construct signature.',
      member,
      configuration,
    ));
    return;
  }


  const constructSignature = constructSignatures[0];

  const importMemberSymbol = constructSignature.getReturnType().getSymbol();

  if (!importMemberSymbol) {
    getCompilationContext().report(new ConfigurationImportError(
      'Could not resolve import symbol.',
      member,
      configuration,
    ));
    return;
  }

  const importMemberDeclarations = importMemberSymbol.getDeclarations() ?? [];

  if (importMemberDeclarations.length === 0) {
    getCompilationContext().report(new ConfigurationImportError(
      'No import signatures found.',
      member,
      configuration,
    ));
    return;
  }

  const importMemberClassDeclarations = importMemberDeclarations.filter(ts.isClassDeclaration);

  if (importMemberClassDeclarations.length === 0) {
    getCompilationContext().report(new ConfigurationImportError(
      'No imported class construct signatures found.',
      member,
      configuration,
    ));
    return;
  }

  if (importMemberClassDeclarations.length !== 1) {
    getCompilationContext().report(new ConfigurationImportError(
      'Imported class mush have only 1 construct signature.',
      member,
      configuration,
    ));
    return;
  }

  const importMemberClassDeclaration = importMemberClassDeclarations[0];

  const processedConfigurationClass = processConfigurationOrApplicationClass(importMemberClassDeclaration, member, configuration);

  if (processedConfigurationClass === null) {
    getCompilationContext().report(new NotSupportedError(
      'Only configuration and application classes can be imported in this context.',
      member,
      configuration,
    ));

    return;
  }

  const imp = new Import({
    classMemberName: member.name?.getText() ?? '',
    node: member,
    resolvedConfiguration: processedConfigurationClass
  });

  configuration.importRegister.register(imp);
}
