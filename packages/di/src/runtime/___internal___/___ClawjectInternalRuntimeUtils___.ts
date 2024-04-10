import { MetadataStorage } from '../MetadataStorage';

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
}
