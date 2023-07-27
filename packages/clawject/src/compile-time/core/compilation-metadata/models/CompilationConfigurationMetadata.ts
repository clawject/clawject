import { CompilationMetadataKind, CompilationMetadata } from './CompilationMetadata';
import { BeanKind } from '../../bean/BeanKind';

export interface CompilationConfigurationMetadata extends CompilationMetadata {
  kind: CompilationMetadataKind.Configuration;
  beans: CompilationBeanMetadata[];
}

export interface CompilationBeanMetadata {
  classMemberName: string;
  kind: BeanKind;
  qualifier: string | null;
  nestedProperty: string | null;
  primary: boolean;
}
