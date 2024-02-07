import { DeclarationMetadata, DeclarationMetadataKind } from './DeclarationMetadata';
import { BeanKind } from '../bean/BeanKind';

export interface ConfigurationDeclarationMetadata extends DeclarationMetadata {
  kind: DeclarationMetadataKind.CONFIGURATION;
  beans: BeanDeclarationMetadata[];
  imports: ImportDeclarationMetadata[];
}

export interface BeanDeclarationMetadata {
  classPropertyName: string;
  qualifier: string | null;
  kind: BeanKind;
  primary: boolean;
  nestedProperty: string | null;
}

export interface ImportDeclarationMetadata {
  classPropertyName: string;
}
