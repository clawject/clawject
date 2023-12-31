import { Configuration } from '../configuration/Configuration';
import { isImportClassProperty } from '../ts/predicates/isImportClassProperty';
import { Import } from './Import';
import ts from 'typescript';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { processConfigurationOrApplicationClass } from '../application-mode/processConfigurationOrApplicationClass';

export const registerImports = (configuration: Configuration): void => {
  configuration.node.members.forEach(member => {
    if (isImportClassProperty(member)) {
      registerImportForClassElementNode(configuration, member);
    }
  });
};

export function registerImportForClassElementNode(configuration: Configuration, member: ts.PropertyDeclaration): void {
  const typeChecker = getCompilationContext().typeChecker;
  const importType = typeChecker.getTypeAtLocation(member);
  const importMembers = importType.getProperties();

  if (importType.isIndexType()) {
    //TODO report compilation error
    throw new Error('Imports type cannot be an index type');
  }

  importMembers.forEach(importMember => {
    const typeOfMember = typeChecker.getTypeOfSymbolAtLocation(importMember, member);
    const constructSignatures = typeOfMember.getConstructSignatures();

    if (constructSignatures.length === 0) {
      //TODO report compilation error
      throw new Error('Import member must be a class declaration');
    }

    if (constructSignatures.length !== 1) {
      //TODO report compilation error
      throw new Error('Import member must have exactly one constructor');
    }

    const constructSignature = constructSignatures[0];

    const importMemberSymbol = constructSignature.getReturnType().getSymbol();

    if (!importMemberSymbol) {
      //TODO report compilation error about can not resolve configuration
      throw new Error('Import member must have a symbol');
    }

    const importMemberDeclarations = importMemberSymbol.getDeclarations() ?? [];

    if (importMemberDeclarations.length === 0) {
      //TODO report compilation error
      throw new Error('Import member must have at least one declaration');
    }

    const importMemberClassDeclarations = importMemberDeclarations.filter(ts.isClassDeclaration);

    if (importMemberClassDeclarations.length === 0) {
      //TODO report compilation error
      throw new Error('Import member must have one class declaration');
    }

    if (importMemberClassDeclarations.length !== 1) {
      //TODO report compilation error
      throw new Error('Import member must have exactly one class declaration');
    }

    const importMemberClassDeclaration = importMemberClassDeclarations[0];

    const processedConfigurationClass = processConfigurationOrApplicationClass(importMemberClassDeclaration);

    const imp = new Import({
      classMemberName: member.name?.getText() ?? '',
      node: member,
    });

    configuration.importRegister.register(imp);
    imp.resolvedConfigurations.set(importMember.name, processedConfigurationClass);
  });
}
