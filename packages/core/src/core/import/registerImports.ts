import { Configuration } from '../configuration/Configuration';
import { Import } from './Import';
import type ts from 'typescript';
import { processConfigurationClass } from '../application-mode/processConfigurationClass';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { ConfigurationAlreadyImportedInfo } from '../../compilation-context/messages/infos/ConfigurationAlreadyImportedInfo';
import { Context } from '../../compilation-context/Context';
import { ClassDefinitionsAccessor } from '../ClassDefinitionsAccessor';
import { readImportDefinitionMetadata } from '../metadata/v2/import/readImportDefinitionMetadata';
import { ImportDefinitionMetadata } from '../metadata/v2/import/ImportDefinitionMetadata';
import { ConfigurationImportError } from '../../compilation-context/messages/errors/ConfigurationImportError';

export const registerImports = (configuration: Configuration): void => {
  const classDefinitions = ClassDefinitionsAccessor.getDefinition(
    configuration.node
  );

  classDefinitions.imports.forEach((it) => {
    const propertyDeclaration = it.getDeclarations() ?? [];
    if (propertyDeclaration.length !== 1) {
      //TODO: report error
      return;
    }

    const importMetadata = readImportDefinitionMetadata(it);
    if (!importMetadata) {
      //TODO: report metadata error
      return;
    }

    registerImportForClassElementNode(
      configuration,
      importMetadata,
      propertyDeclaration[0] as ts.PropertyDeclaration
    );
  });
};

export function registerImportForClassElementNode(
  configuration: Configuration,
  importDefinitionMetadata: ImportDefinitionMetadata,
  propertyDeclaration: ts.PropertyDeclaration
): void {
  const importedClassSymbol = importDefinitionMetadata.type.getSymbol() ?? importDefinitionMetadata.type.symbol;
  const importedClassDeclarations = importedClassSymbol.getDeclarations() ?? [];
  if (importedClassDeclarations.length === 0) {
    Context.report(
      new ConfigurationImportError(
        'Imported class not found.',
        propertyDeclaration,
        configuration,
        null
      )
    );
    return;
  }

  //TODO support class expressions?: Import(class {...});
  const importMemberClassDeclarations = importedClassDeclarations.filter(Context.ts.isClassDeclaration);

  if (importMemberClassDeclarations.length === 0) {
    Context.report(
      new ConfigurationImportError(
        'Imported class not found.',
        propertyDeclaration,
        configuration,
        null
      )
    );
    return;
  }

  if (importMemberClassDeclarations.length !== 1) {
    Context.report(
      new ConfigurationImportError(
        'Imported class mush have only 1 class declaration.',
        propertyDeclaration,
        configuration,
        null
      )
    );
    return;
  }

  const importMemberClassDeclaration = importMemberClassDeclarations[0];
  const processedConfigurationClass = processConfigurationClass(
    importMemberClassDeclaration,
    propertyDeclaration,
    configuration
  );

  if (processedConfigurationClass === null) {
    Context.report(
      new NotSupportedError(
        'Only configuration and application classes can be imported in this context.',
        propertyDeclaration,
        configuration,
        null
      )
    );

    return;
  }

  let wasAlreadyImported = false;

  for (const importedConfigurationElement of configuration.importRegister.elements) {
    if (importedConfigurationElement.resolvedConfiguration === processedConfigurationClass) {
      wasAlreadyImported = true;
      Context.report(
        new ConfigurationAlreadyImportedInfo(
          propertyDeclaration,
          [importedConfigurationElement],
          configuration,
          null
        )
      );
      break;
    }
  }

  if (wasAlreadyImported) {
    return;
  }

  const imp = new Import({
    classMemberName: propertyDeclaration.name?.getText() ?? '',
    node: propertyDeclaration,
    resolvedConfiguration: processedConfigurationClass,
    definitionMetadata: importDefinitionMetadata,
  });

  configuration.importRegister.register(imp);
}

//TODO
function verifyModifiers(
  node: ts.PropertyDeclaration,
  parentConfiguration: Configuration
): boolean {
  const RESTRICTED_MODIFIERS = new Map<ts.SyntaxKind, string>([
    [Context.ts.SyntaxKind.AbstractKeyword, 'abstract'],
    [Context.ts.SyntaxKind.StaticKeyword, 'static'],
    [Context.ts.SyntaxKind.DeclareKeyword, 'declare'],
    [Context.ts.SyntaxKind.PrivateKeyword, 'private'],
  ]);

  const compilationContext = Context;
  const restrictedModifier = node.modifiers?.find((it) =>
    RESTRICTED_MODIFIERS.has(it.kind)
  );

  if (!restrictedModifier) {
    return true;
  }

  compilationContext.report(
    new NotSupportedError(
      `Import configuration declaration should not have modifier ${RESTRICTED_MODIFIERS.get(
        restrictedModifier.kind
      )}.`,
      node.name,
      parentConfiguration,
      null
    )
  );

  return false;
}
