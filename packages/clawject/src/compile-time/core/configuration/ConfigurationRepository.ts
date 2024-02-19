import ts from 'typescript';
import { Configuration } from './Configuration';
import { unquoteString } from '../utils/unquoteString';
import { getExternalValueFromNode } from '../ts/utils/getExternalValueFromNode';
import { getConfigurationScopeExpressionValue } from './getConfigurationScopeExpressionValue';
import { getConfigurationLazyExpressionValue } from './getConfigurationLazyExpressionValue';

export class ConfigurationRepository {
  static fileNameToLastConfigurationCounter = new Map<string, number>();
  static fileNameToConfigurations = new Map<string, Configuration[]>();
  static configurationIdToConfiguration = new Map<string, Configuration>();
  static nodeToConfiguration = new WeakMap<ts.ClassDeclaration, Configuration>();

  static register(classDeclaration: ts.ClassDeclaration): Configuration {
    const sourceFile = classDeclaration.getSourceFile();

    const configuration = new Configuration();

    configuration.id = this.buildId(classDeclaration);
    configuration.fileName = classDeclaration.getSourceFile().fileName;
    configuration.node = classDeclaration;
    configuration.external = getExternalValueFromNode(classDeclaration);
    configuration.scopeExpression.value = getConfigurationScopeExpressionValue(configuration);
    configuration.lazyExpression.value = getConfigurationLazyExpressionValue(configuration);

    if (classDeclaration.name !== undefined) {
      configuration.className = unquoteString(classDeclaration.name.getText());
    }

    const configurations = this.fileNameToConfigurations.get(sourceFile.fileName) ?? [];
    this.fileNameToConfigurations.set(sourceFile.fileName, configurations);
    configurations.push(configuration);

    this.configurationIdToConfiguration.set(configuration.id, configuration);
    this.nodeToConfiguration.set(classDeclaration, configuration);

    return configuration;
  }

  static getConfigurationByBeanId(beanId: string): Configuration | null {
    const contextId = beanId.match(/(.*)_\d+$/);

    if (contextId === null) {
      return null;
    }

    return this.configurationIdToConfiguration.get(contextId[1]) ?? null;
  }

  static clear(): void {
    this.fileNameToConfigurations.clear();
    this.fileNameToLastConfigurationCounter.clear();
    this.configurationIdToConfiguration.clear();
  }

  static clearByFileName(fileName: string): void {
    const configurations = this.fileNameToConfigurations.get(fileName) ?? [];

    this.fileNameToConfigurations.delete(fileName);
    this.fileNameToLastConfigurationCounter.delete(fileName);
    configurations.forEach(configuration => {
      this.configurationIdToConfiguration.delete(configuration.id);

      const configurationNode = configuration.getNodeSafe();

      if (configurationNode) {
        this.nodeToConfiguration.delete(configurationNode);
      }
    });
  }

  private static buildId(classDeclaration: ts.ClassDeclaration): string {
    const sourceFile = classDeclaration.getSourceFile();
    const lastConfigurationCounter = this.fileNameToLastConfigurationCounter.get(sourceFile.fileName);
    const newCounter = (lastConfigurationCounter ?? 0) + 1;
    this.fileNameToLastConfigurationCounter.set(sourceFile.fileName, newCounter);

    return `${sourceFile.fileName}_${newCounter}`;
  }
}
