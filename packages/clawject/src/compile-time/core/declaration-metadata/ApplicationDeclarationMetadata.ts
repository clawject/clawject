import { DeclarationMetadata, DeclarationMetadataKind } from './DeclarationMetadata';
import { ConfigurationDeclarationMetadata } from './ConfigurationDeclarationMetadata';

export interface ApplicationDeclarationMetadata extends Omit<ConfigurationDeclarationMetadata, 'kind'>, DeclarationMetadata {
  kind: DeclarationMetadataKind.APPLICATION;
}
