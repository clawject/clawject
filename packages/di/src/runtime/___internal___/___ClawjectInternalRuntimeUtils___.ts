import { MetadataStorage } from '../MetadataStorage';
import { RuntimeApplicationMetadata } from '@clawject/core/runtime-metadata/RuntimeApplicationMetadata';

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

  public static defineDevelopmentApplicationMetadata(developmentId: string, projectVersion: number, metadata: RuntimeApplicationMetadata): void {
    MetadataStorage.setDevelopmentApplicationMetadata(developmentId, projectVersion, metadata);
  }
}
