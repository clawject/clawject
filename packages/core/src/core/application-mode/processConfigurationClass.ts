import type ts from 'typescript';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { registerImports } from '../import/registerImports';
import { registerBeans } from '../bean/registerBeans';
import { Configuration } from '../configuration/Configuration';
import { Logger } from '../../logger/Logger';
import { IncorrectNameError } from '../../compilation-context/messages/errors/IncorrectNameError';
import { Context } from '../../compilation-context/Context';
import { readConfigurationDefinitionMetadata } from '../metadata/v2/configuration/readConfigurationDefinitionMetadata';
import { ClassDefinitionsAccessor } from '../ClassDefinitionsAccessor';

export const processConfigurationClass = (
  node: ts.ClassDeclaration,
  parentImportNode: ts.Node | null,
  parentConfiguration: Configuration | null
): Configuration | null => {
  if (!node.name) {
    Context.report(
      new IncorrectNameError(
        'Configuration or application class must have a name.',
        node,
        parentConfiguration,
        null
      )
    );
    return null;
  }

  const registeredConfiguration =
    ConfigurationRepository.nodeToConfiguration.get(node);

  if (registeredConfiguration) {
    return registeredConfiguration;
  }

  const classDefinitions = ClassDefinitionsAccessor.getDefinition(node);
  if (classDefinitions.configurations.length > 1) {
    throw 'TODO, can only be 0 or 1 definitions';
  }

  const configurationMetadata = readConfigurationDefinitionMetadata(
    classDefinitions.configurations[0] ?? null
  );

  if (!configurationMetadata) {
    return null;
  }

  const configuration = ConfigurationRepository.register(
    node,
    configurationMetadata
  );

  const registerImportsLabel = `Registering imports (decorated class), file: ${
    node.getSourceFile().fileName
  }, class: ${node.name?.text}`;
  Logger.verboseDuration(registerImportsLabel);
  registerImports(configuration);
  Logger.verboseDuration(registerImportsLabel);

  const registerBeansLabel = `Registering beans (decorated class), file: ${
    node.getSourceFile().fileName
  }, class: ${node.name?.text}`;
  Logger.verboseDuration(registerBeansLabel);
  registerBeans(configuration);
  Logger.verboseDuration(registerBeansLabel);

  return configuration;
};
