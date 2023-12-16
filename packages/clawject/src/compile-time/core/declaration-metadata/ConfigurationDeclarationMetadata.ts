import { DeclarationMetadata, DeclarationMetadataKind } from './DeclarationMetadata';
import { BeanKind } from '../bean/BeanKind';

export interface ConfigurationDeclarationMetadata extends DeclarationMetadata {
  kind: DeclarationMetadataKind.CONFIGURATION;
  beans: Record<string, BeanDeclarationMetadata>;
  imports: Record<string, {}>;
}

export interface BeanDeclarationMetadata {
  qualifier: string | null;
  kind: BeanKind;
  primary: boolean;
  nestedProperty: string | null;
}
