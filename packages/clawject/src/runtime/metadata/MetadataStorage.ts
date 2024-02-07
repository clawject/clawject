import { ClassConstructor } from '../ClassConstructor';
import { CatContext } from '../CatContext';

import { RuntimeContextMetadata } from './RuntimeContextMetadata';
import { RuntimeComponentMetadata } from './RuntimeComponentMetadata';
import { ContextIdStorage } from '../ContextIdStorage';
import { InternalUtils } from '../InternalUtils';
import { RuntimeConfigurationMetadata } from './RuntimeConfigurationMetadata';
import { RuntimeApplicationMetadata } from './RuntimeApplicationMetadata';

export enum MetadataKind {
  CONTEXT = 'CONTEXT_METADATA',
  COMPONENT = 'COMPONENT_METADATA',
  CONFIGURATION_METADATA = 'CONFIGURATION_METADATA',
  APPLICATION_METADATA = 'APPLICATION_METADATA',
}

class MetadataStorageState {
  [MetadataKind.CONTEXT] = new WeakMap<ClassConstructor<CatContext>, RuntimeContextMetadata>();
  [MetadataKind.COMPONENT] = new WeakMap<ClassConstructor<any>, RuntimeComponentMetadata>();
  [MetadataKind.CONFIGURATION_METADATA] = new WeakMap<ClassConstructor<any>, RuntimeConfigurationMetadata>();
  [MetadataKind.APPLICATION_METADATA] = new WeakMap<ClassConstructor<any>, RuntimeApplicationMetadata>();
}

export class MetadataStorage {
  private static storage = InternalUtils.createVersionedStorageOrGetIfExisted('metadata_storage', 0, new MetadataStorageState());
  private static contextMetadata = this.storage[MetadataKind.CONTEXT];
  private static componentMetadata = this.storage[MetadataKind.COMPONENT];
  private static configurationMetadata = this.storage[MetadataKind.CONFIGURATION_METADATA];
  private static applicationMetadata = this.storage[MetadataKind.APPLICATION_METADATA];

  static getContextMetadata(clazz: ClassConstructor<CatContext>): RuntimeContextMetadata | null {
    return this.contextMetadata.get(clazz) ?? null;
  }

  static setContextMetadata(clazz: ClassConstructor<CatContext>, metadata: Omit<RuntimeContextMetadata, 'id'>): void {
    metadata['id'] = ContextIdStorage.getAndInc();
    this.contextMetadata.set(clazz, metadata as RuntimeContextMetadata);
  }

  static getComponentMetadataByClassInstance(instance: any): RuntimeComponentMetadata | null {
    const instanceConstructor = InternalUtils.getConstructorFromInstance(instance);

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
