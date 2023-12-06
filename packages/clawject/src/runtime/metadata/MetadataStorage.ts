import { ClassConstructor } from '../ClassConstructor';
import { CatContext } from '../CatContext';

import { RuntimeContextMetadata } from './RuntimeContextMetadata';
import { RuntimeComponentMetadata } from './RuntimeComponentMetadata';
import { ContextIdStorage } from '../ContextIdStorage';
import { InternalUtils } from '../InternalUtils';

export enum MetadataKind {
  CONTEXT = 'CONTEXT_METADATA',
  COMPONENT = 'COMPONENT_METADATA',
}

class MetadataStorageState {
  [MetadataKind.CONTEXT] = new WeakMap<ClassConstructor<CatContext>, RuntimeContextMetadata>();
  [MetadataKind.COMPONENT] = new WeakMap<ClassConstructor<any>, RuntimeComponentMetadata>();
}

export class MetadataStorage {
  private static storage = InternalUtils.createVersionedStorageOrGetIfExisted('metadata_storage', 0, new MetadataStorageState());
  private static contextMetadata = this.storage[MetadataKind.CONTEXT];
  private static componentMetadata = this.storage[MetadataKind.COMPONENT];

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
}
