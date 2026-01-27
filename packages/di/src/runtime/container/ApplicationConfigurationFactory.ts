import { ClassConstructor } from '../api/ClassConstructor';
import { ApplicationConfiguration } from './ApplicationConfiguration';
import { MaybePromise } from '../types/MaybePromise';
import { Utils } from '../Utils';
import { ImportDefinition } from '../api/import/ImportDefinition';

export class ApplicationConfigurationFactory {
  private applicationConfigurations: ApplicationConfiguration[] = [];
  private indexToConfigurationClass = new Map<number, ClassConstructor<any>>();
  private configurationClassToApplicationConfiguration = new Map<ClassConstructor<any>, ApplicationConfiguration>();

  private lastConfigurationId = 0;
  private configurationClassToId = new Map<ClassConstructor<any>, number>();

  async init(
    applicationClass: ClassConstructor<any>,
    applicationClassConstructorParameters: any[],
  ): Promise<void> {
    const visited = new Set<ClassConstructor<any>>();
    const firstApplicationConfiguration = this.buildApplicationConfiguration(applicationClass, applicationClassConstructorParameters);
    const stack = [firstApplicationConfiguration];

    while (stack.length > 0) {
      const current = stack.pop()!;

      const applicationClass = current.classConstructor;
      const configurationMetadata = current.metadata;
      const instance = current.instance;

      visited.add(applicationClass);
      this.applicationConfigurations.push(current);

      const elements = configurationMetadata.imports.map(it => it.classPropertyName);
      const importedConfigurationsClasses: MaybePromise<{
        constructor: ClassConstructor<any>;
        args: MaybePromise<any[]>;
      }>[] = [];

      // for (let i = elements.length - 1; i >= 0; i--) {
      //   const importPropertyName = elements[i];
      //   const importedConfiguration = instance[importPropertyName] as ImportDefinition<any, any>;
      //   const configurationConstructor = importedConfiguration.classConstructor();
      //
      //   importedConfigurationConstruction = {
      //     constructor: importedConfiguration.classConstructor,
      //     //TODO
      //     // @ts-ignore
      //     args: Utils.getResolvedConstructorParameters(importedConfiguration.constructorParameters),
      //   };
      //
      //   importedConfigurationsClasses.push(importedConfigurationConstruction);
      // }

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
          stack.push(this.buildApplicationConfiguration(it.constructor, it.args));
        }
      });
    }

    this.applicationConfigurations.forEach((applicationConfiguration, index) => {
      const configurationClass = applicationConfiguration.classConstructor;
      const configurationId = this.configurationClassToId.get(configurationClass) ?? this.lastConfigurationId++;

      if (!this.configurationClassToId.has(configurationClass)) {
        this.configurationClassToId.set(configurationClass, configurationId);
      }

      applicationConfiguration.init(index, configurationId);

      this.indexToConfigurationClass.set(index, configurationClass);
    });
  }

  public mapConfigurations<T>(callback: (applicationConfiguration: ApplicationConfiguration) => T): T[] {
    return Array.from(this.configurationClassToApplicationConfiguration.values()).map((applicationConfiguration) => {
      return callback(applicationConfiguration);
    });
  }

  public getConfigurationByIndex(index: number): ApplicationConfiguration {
    if (!this.applicationConfigurations[index]) {
      throw new Error(`No configuration found for index ${index}`);
    }

    return this.applicationConfigurations[index];
  }

  private buildApplicationConfiguration(...args: ConstructorParameters<typeof ApplicationConfiguration>): ApplicationConfiguration {
    const applicationConfiguration = this.configurationClassToApplicationConfiguration.get(args[0]) ??  new ApplicationConfiguration(...args);

    if (!this.configurationClassToApplicationConfiguration.has(args[0])) {
      this.configurationClassToApplicationConfiguration.set(args[0], applicationConfiguration);
    }

    return applicationConfiguration;
  }
}
