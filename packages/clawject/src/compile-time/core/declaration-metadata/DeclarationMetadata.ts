export interface DeclarationMetadata {
  kind: DeclarationMetadataKind;
  version: number;
}

export enum DeclarationMetadataKind {
  CONFIGURATION = 'configuration',
  APPLICATION = 'application',
}
