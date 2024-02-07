export interface DeclarationMetadata {
  kind: DeclarationMetadataKind;
  version: number;
}

export enum DeclarationMetadataKind {
  CONFIGURATION = 1,
  APPLICATION = 2,
}
