import { ClassConstructor } from '../api/ClassConstructor';
import { ImportedConfiguration } from '../api/Import';
import { ApplicationConfiguration } from './ApplicationConfiguration';
import { MaybeAsync } from '../types/MaybeAsync';
import { Utils } from '../Utils';

export class ApplicationConfigurationFactory {
  private applicationConfigurations: ApplicationConfiguration[] = [];

  async init(applicationClass: ClassConstructor<any>): Promise<void> {
    const visited = new Set<ClassConstructor<any>>();
    const firstApplicationConfiguration = new ApplicationConfiguration(applicationClass);
    const stack = [firstApplicationConfiguration];

    while (stack.length > 0) {
      const current = stack.pop()!;

      const applicationClass = current.classConstructor;
      const configurationMetadata = current.metadata;
      const instance = current.instance;

      visited.add(applicationClass);
      this.applicationConfigurations.push(current);

      const elements = configurationMetadata.imports.map(it => it.classPropertyName);
      const importedConfigurationClasses: MaybeAsync<ClassConstructor<any>>[] = [];

      for (let i = elements.length - 1; i >= 0; i--) {
        const importPropertyName = elements[i];
        const importedConfiguration = instance[importPropertyName] as MaybeAsync<ImportedConfiguration<any>>;
        let importedConfigurationConstructor: MaybeAsync<ClassConstructor<any>>;

        if (Utils.isPromise(importedConfiguration)) {
          importedConfigurationConstructor = importedConfiguration
            .then((importedConfiguration) => importedConfiguration.constructor);
        } else {
          importedConfigurationConstructor = importedConfiguration.constructor;
        }

        importedConfigurationClasses.push(importedConfigurationConstructor);
      }

      const configurationClasses = await Promise.all(importedConfigurationClasses);

      configurationClasses.forEach((configurationClass) => {
        if (!visited.has(configurationClass)) {
          stack.push(new ApplicationConfiguration(configurationClass));
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
