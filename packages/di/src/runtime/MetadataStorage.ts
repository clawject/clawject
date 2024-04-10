import { ClassConstructor } from './api/ClassConstructor';
import { Utils } from './Utils';
import { RuntimeComponentMetadata } from '@clawject/core/runtime-metadata/RuntimeComponentMetadata';
import { RuntimeConfigurationMetadata } from '@clawject/core/runtime-metadata/RuntimeConfigurationMetadata';
import { RuntimeApplicationMetadata } from '@clawject/core/runtime-metadata/RuntimeApplicationMetadata';

export enum MetadataKind {
  COMPONENT = 'COMPONENT_METADATA',
  CONFIGURATION_METADATA = 'CONFIGURATION_METADATA',
  APPLICATION_METADATA = 'APPLICATION_METADATA',
}

class MetadataStorageState {
  [MetadataKind.COMPONENT] = new WeakMap<ClassConstructor<any>, RuntimeComponentMetadata>();
  [MetadataKind.CONFIGURATION_METADATA] = new WeakMap<ClassConstructor<any>, RuntimeConfigurationMetadata>();
  [MetadataKind.APPLICATION_METADATA] = new WeakMap<ClassConstructor<any>, RuntimeApplicationMetadata>();
}

export class MetadataStorage {
  private static storage = Utils.createVersionedStorageOrGetIfExisted('metadata_storage', 0, new MetadataStorageState());
  private static componentMetadata = this.storage[MetadataKind.COMPONENT];
  private static configurationMetadata = this.storage[MetadataKind.CONFIGURATION_METADATA];
  private static applicationMetadata = this.storage[MetadataKind.APPLICATION_METADATA];

  static getComponentMetadataByClassInstance(instance: any): RuntimeComponentMetadata | null {
    const instanceConstructor = Utils.getConstructorFromInstance(instance);

    if (instanceConstructor === null) {
      return null;
    }

    return this.getComponentMetadataByClassConstructor(instanceConstructor);
  }

  static getComponentMetadataByClassConstructor(clazz: ClassConstructor<any>): RuntimeComponentMetadata | null {
    return this.componentMetadata.get(clazz) ?? null;
  }

  static setComponentMetadata(clazz: ClassConstructor<any>, metadata: RuntimeComponentMetadata): void {
    this.componentMetadata.set(clazz, metadata);
  }

  static getConfigurationMetadata(clazz: ClassConstructor<any>): RuntimeConfigurationMetadata | null {
    return this.configurationMetadata.get(clazz) ?? null;
  }

  static setConfigurationMetadata(clazz: ClassConstructor<any>, metadata: RuntimeConfigurationMetadata): void {
    this.configurationMetadata.set(clazz, metadata);
  }

  static getApplicationMetadata(clazz: ClassConstructor<any>): RuntimeApplicationMetadata | null {
    return this.applicationMetadata.get(clazz) ?? null;
  }

  static setApplicationMetadata(clazz: ClassConstructor<any>, metadata: RuntimeApplicationMetadata): void {
    this.applicationMetadata.set(clazz, metadata);
  }
}
