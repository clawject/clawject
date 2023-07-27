export enum CompilationMetadataKind {
  Component = 'Component',
  Configuration = 'Configuration',
}

export interface CompilationMetadata {
  kind: CompilationMetadataKind;
  clawjectVersion: string;
}

