import { ClassConstructor } from '../api/ClassConstructor';
import { ImportedConfiguration } from '../api/Import';
import { ApplicationConfiguration } from './ApplicationConfiguration';
import { MaybeAsync } from '../types/MaybeAsync';
import { Utils } from '../Utils';

export class ApplicationConfigurationFactory {
  private applicationConfigurations: ApplicationConfiguration[] = [];

  async init(
    applicationClass: ClassConstructor<any>,
    applicationClassConstructorParameters: any[],
  ): Promise<void> {
    const visited = new Set<ClassConstructor<any>>();
    const firstApplicationConfiguration = new ApplicationConfiguration(applicationClass, applicationClassConstructorParameters);
    const stack = [firstApplicationConfiguration];

    while (stack.length > 0) {
      const current = stack.pop()!;

      const applicationClass = current.classConstructor;
      const configurationMetadata = current.metadata;
      const instance = current.instance;

      visited.add(applicationClass);
      this.applicationConfigurations.push(current);

      const elements = configurationMetadata.imports.map(it => it.classPropertyName);
      const importedConfigurationsClasses: MaybeAsync<{
        constructor: ClassConstructor<any>;
        args: MaybeAsync<any[]>;
      }>[] = [];

      for (let i = elements.length - 1; i >= 0; i--) {
        const importPropertyName = elements[i];
        const importedConfiguration = instance[importPropertyName] as MaybeAsync<ImportedConfiguration<any, any>>;

        let importedConfigurationConstruction: MaybeAsync<{
          constructor: ClassConstructor<any>;
          args: MaybeAsync<any[]>;
        }>;

        if (Utils.isPromise(importedConfiguration)) {
          importedConfigurationConstruction = importedConfiguration
            .then((importedConfiguration) => {
              return {
                constructor: importedConfiguration.constructor,
                args: Utils.getResolvedConstructorParameters(importedConfiguration.constructorParameters),
              };
            });
        } else {
          importedConfigurationConstruction = {
            constructor: importedConfiguration.constructor,
            args: Utils.getResolvedConstructorParameters(importedConfiguration.constructorParameters),
          };
        }

        importedConfigurationsClasses.push(importedConfigurationConstruction);
      }

      const configurationClasses = await Promise.all(importedConfigurationsClasses.map(async(it) => {
        const awaitedIt = await it;
        const awaitedItArgs = await awaitedIt.args;

        return {
          constructor: awaitedIt.constructor,
          args: awaitedItArgs,
        };
      }));

      configurationClasses.forEach((it) => {
        if (!visited.has(it.constructor)) {
          stack.push(new ApplicationConfiguration(it.constructor, it.args));
        }
      });
    }

    this.applicationConfigurations.forEach((applicationConfiguration, index) => {
      applicationConfiguration.init(index);
    });
  }

  public mapConfigurations<T>(callback: (applicationConfiguration: ApplicationConfiguration) => T): T[] {
    return this.applicationConfigurations.map((applicationConfiguration) => {
      return callback(applicationConfiguration);
    });
  }
}
