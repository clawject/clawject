import { ApplicationMetadataV2 } from '@clawject/core/runtime-metadata/v2/ApplicationMetadataV2';
import { MetadataStorage } from './MetadataStorage';
import { Container } from './container_2/Container';
import { ContainerScope } from './container_2/ContainerScope';

export class ApplicationRunner {
  async run(classConstructor: any, additionalScopes: Map<string, ContainerScope>): Promise<void> {
    const metadata = MetadataStorage.getApplicationMetadata(classConstructor) as unknown as ApplicationMetadataV2;

    const container = new Container(metadata, additionalScopes);
    await container.start(classConstructor);
  }
}
