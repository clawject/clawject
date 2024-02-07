import { ClassConstructor } from '../ClassConstructor';
import { ImportedConfiguration } from '../Import';
import { RuntimeConfigurationMetadata } from '../metadata/RuntimeConfigurationMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';

export class ApplicationConfigurationFactory {
  instanceToConfigurationClass = new Map<any, ClassConstructor<any>>();
  configurationClassToInstance = new Map<ClassConstructor<any>, any>();
  configurationInstances: any[] = [];

  init(applicationClass: ClassConstructor<any>): void {
    const visited = new Set<ClassConstructor<any>>();
    const stack: [applicationClass: ClassConstructor<any>, configurationMetadata: RuntimeConfigurationMetadata][] = [[applicationClass, this.getConfigurationMetadataUnsafe(applicationClass)]];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const [applicationClass, configurationMetadata] = current;
      let instance = this.configurationClassToInstance.get(applicationClass);

      if (!instance) {
        instance = new applicationClass();
        this.configurationClassToInstance.set(applicationClass, instance);
        this.instanceToConfigurationClass.set(instance, applicationClass);
      }
      visited.add(applicationClass);

      const elements = configurationMetadata.imports.map(it => it.classPropertyName);

      for (let i = elements.length - 1; i >= 0; i--) {
        const importPropertyName = elements[i];
        const importedConfiguration = instance[importPropertyName] as ImportedConfiguration<any>;

        if (!visited.has(importedConfiguration.constructor)) {
          stack.push(
            [importedConfiguration.constructor, this.getConfigurationMetadataUnsafe(importedConfiguration.constructor)]
          );
        }
      }

      this.configurationInstances.push(instance);
    }
  }

  public forEachConfiguration(callback: (instance: any, metadata: RuntimeConfigurationMetadata, index: number) => void): void {
    this.configurationInstances.forEach((instance, index) => {
      const metadata = this.getConfigurationMetadataByInstanceUnsafe(instance);

      callback(instance, metadata, index);
    });
  }

  public getConfigurationMetadataByInstanceUnsafe(instance: any): RuntimeConfigurationMetadata {
    const clazz = this.instanceToConfigurationClass.get(instance);

    if (clazz === undefined) {
      //TODO runtime error
      throw new Error('No configuration class found');
    }

    return this.getConfigurationMetadataUnsafe(clazz);
  }

  public getConfigurationInstanceByIndexUnsafe(index: number): any {
    const instance = this.configurationInstances[index];

    if (!instance) {
      //TODO runtime error
      throw new Error('No configuration instance found');
    }

    return instance;
  }

  private getConfigurationMetadataUnsafe(clazz: ClassConstructor<any>): RuntimeConfigurationMetadata {
    const metadata = MetadataStorage.getApplicationMetadata(clazz) ?? MetadataStorage.getConfigurationMetadata(clazz);

    if (metadata === null) {
      //TODO runtime error
      throw new Error('No configuration metadata found');
    }

    return metadata;
  }
}
