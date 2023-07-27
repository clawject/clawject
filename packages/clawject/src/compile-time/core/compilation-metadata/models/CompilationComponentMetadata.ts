import { CompilationMetadataKind, CompilationMetadata } from './CompilationMetadata';

export interface CompilationComponentMetadata extends CompilationMetadata {
  kind: CompilationMetadataKind.Component;
  qualifier: string | null;
}
