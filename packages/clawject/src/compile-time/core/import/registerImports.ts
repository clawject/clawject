import { Configuration } from '../configuration/Configuration';
import { isImportClassProperty } from '../ts/predicates/isImportClassProperty';
import { Import } from './Import';
import ts from 'typescript';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { processConfigurationOrApplicationClass } from '../application-mode/processConfigurationOrApplicationClass';
import { ConfigurationImportError } from '../../compilation-context/messages/errors/ConfigurationImportError';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { getExternalValueFromNode } from '../ts/utils/getExternalValueFromNode';
import { CType } from '../type-system/CType';

const RESTRICTED_MODIFIERS = new Map<ts.SyntaxKind, string>([
  [ts.SyntaxKind.AbstractKeyword, 'abstract'],
  [ts.SyntaxKind.StaticKeyword, 'static'],
  [ts.SyntaxKind.DeclareKeyword, 'declare'],
  [ts.SyntaxKind.PrivateKeyword, 'private'],
]);

export const registerImports = (configuration: Configuration): void => {
  configuration.node.members.forEach(member => {
    if (isImportClassProperty(member)) {
      if (!verifyModifiers(member, configuration)) {
        return;
      }

      registerImportForClassElementNode(configuration, member, getExternalValueFromNode(member));
    }
  });
};

export function registerImportForClassElementNode(configuration: Configuration, member: ts.PropertyDeclaration, externalValue: boolean | null): void {
  const typeChecker = getCompilationContext().typeChecker;
  const nodeType = typeChecker.getTypeAtLocation(member);
  let importType = new CType(nodeType);
  importType = importType.getPromisedType() ?? importType;

  const properties = importType.tsType.getProperties();
  const constructor = properties.find(it => it.getName() === 'constructor');

  if (!constructor) {
    getCompilationContext().report(new ConfigurationImportError(
      'Import must have a constructor property.',
      member,
      configuration,
      null,
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
      null,
    ));
    return;
  }

  if (constructSignatures.length !== 1) {
    getCompilationContext().report(new ConfigurationImportError(
      'Imported class mush have only 1 construct signature.',
      member,
      configuration,
      null,
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
      null,
    ));
    return;
  }

  const importMemberDeclarations = importMemberSymbol.getDeclarations() ?? [];

  if (importMemberDeclarations.length === 0) {
    getCompilationContext().report(new ConfigurationImportError(
      'No import signatures found.',
      member,
      configuration,
      null,
    ));
    return;
  }

  const importMemberClassDeclarations = importMemberDeclarations.filter(ts.isClassDeclaration);

  if (importMemberClassDeclarations.length === 0) {
    getCompilationContext().report(new ConfigurationImportError(
      'No imported class construct signatures found.',
      member,
      configuration,
      null,
    ));
    return;
  }

  if (importMemberClassDeclarations.length !== 1) {
    getCompilationContext().report(new ConfigurationImportError(
      'Imported class mush have only 1 construct signature.',
      member,
      configuration,
      null
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
      null
    ));

    return;
  }

  const imp = new Import({
    classMemberName: member.name?.getText() ?? '',
    node: member,
    resolvedConfiguration: processedConfigurationClass,
    external: externalValue,
  });

  configuration.importRegister.register(imp);
}

function verifyModifiers(node: ts.PropertyDeclaration, parentConfiguration: Configuration): boolean {
  const compilationContext = getCompilationContext();
  const restrictedModifier = node.modifiers?.find(it => RESTRICTED_MODIFIERS.has(it.kind));

  if (!restrictedModifier) {
    return true;
  }

  compilationContext.report(new NotSupportedError(
    `Import configuration declaration should not have modifier ${RESTRICTED_MODIFIERS.get(restrictedModifier.kind)}.`,
    node.name,
    parentConfiguration,
    null
  ));

  return false;
}
