import { MetadataStorage } from '../MetadataStorage';
import { RuntimeDevelopmentApplicationMetadata } from '@clawject/core/runtime-metadata/RuntimeApplicationMetadata';

export class ___ClawjectInternalRuntimeUtils___ {
  public static defineComponentMetadata(classConstructor: any, metadata: any): void {
    MetadataStorage.setComponentMetadata(classConstructor, metadata);
  }

  public static defineConfigurationMetadata(classConstructor: any, metadata: any): void {
    MetadataStorage.setConfigurationMetadata(classConstructor, metadata);
  }

  public static defineApplicationMetadata(classConstructor: any, metadata: any): void {
    MetadataStorage.setApplicationMetadata(classConstructor, metadata);
  }

  public static defineDevelopmentApplicationMetadata(developmentId: string, projectVersion: number, metadata: RuntimeDevelopmentApplicationMetadata): void {
    MetadataStorage.setDevelopmentApplicationMetadata(developmentId, projectVersion, metadata);
  }

  public static createSizedSymbolArray(size: number): symbol[] {
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      array[i] = Symbol();
    }
    return array;
  }

  public static createMap(entries: [any, any][]): Map<any, any> {
    return new Map(entries);
  }
}
