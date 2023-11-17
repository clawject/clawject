import { ClawjectObjectStorage } from '@clawject/object-storage';

import { ClassConstructor } from '../ClassConstructor';
import { CatContext } from '../CatContext';

import { RuntimeContextMetadata } from './RuntimeContextMetadata';
import { RuntimeComponentMetadata } from './RuntimeComponentMetadata';
import { Utils } from '../___internal___/Utils';

export enum MetadataKind {
  CONTEXT = 'CONTEXT_METADATA',
  COMPONENT = 'COMPONENT_METADATA',
}

interface MetadataStorageType {
  [MetadataKind.CONTEXT]: WeakMap<ClassConstructor<CatContext>, RuntimeContextMetadata>;
  [MetadataKind.COMPONENT]: WeakMap<ClassConstructor<any>, RuntimeComponentMetadata>;
}

export class MetadataStorage {
  private static STORAGE_KEY = 'metadata_storage';
  private static VERSION = 0;

  private static contextMetadata: MetadataStorageType[MetadataKind.CONTEXT];
  private static componentMetadata: MetadataStorageType[MetadataKind.COMPONENT];

  static {
    const metadataStorages: Map<number, MetadataStorageType> = ClawjectObjectStorage.getOrSetIfNotPresent(this.STORAGE_KEY, new Map());
    let metadataStorage = metadataStorages.get(this.VERSION);

    if (!metadataStorage) {
      metadataStorage = {
        [MetadataKind.CONTEXT]: new WeakMap(),
        [MetadataKind.COMPONENT]: new WeakMap(),
      };
      metadataStorages.set(this.VERSION, metadataStorage);
    }

    this.contextMetadata = metadataStorage[MetadataKind.CONTEXT];
    this.componentMetadata = metadataStorage[MetadataKind.COMPONENT];
  }

  static getContextMetadata(clazz: ClassConstructor<CatContext>): RuntimeContextMetadata | null {
    return this.contextMetadata.get(clazz) ?? null;
  }

  static setContextMetadata(clazz: ClassConstructor<CatContext>, metadata: RuntimeContextMetadata): void {
    this.contextMetadata.set(clazz, metadata);
  }

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
}
