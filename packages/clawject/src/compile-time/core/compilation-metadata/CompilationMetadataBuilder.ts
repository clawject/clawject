import { Configuration } from '../configuration/Configuration';
import { CompilationConfigurationMetadata } from './models/CompilationConfigurationMetadata';
import { CompilationMetadataKind } from './models/CompilationMetadata';
import { COMPILATION_METADATA_TOKENS } from './constants';
import { CONSTANTS } from '../../../constants';
import { CompilationComponentMetadata } from './models/CompilationComponentMetadata';
import { Component } from '../component/Component';

export class CompilationMetadataBuilder {
  static buildForConfiguration(configuration: Configuration): string {
    const metadata = this.buildCompilationMetadataForConfiguration(configuration);

    return this.stringifyMetadata(metadata);
  }

  static buildForComponent(component: Component): string {
    const metadata = this.buildCompilationMetadataForComponent(component);

    return this.stringifyMetadata(metadata);
  }

  private static stringifyMetadata(data: any): string {
    return [
      COMPILATION_METADATA_TOKENS.HEADER,
      JSON.stringify(data),
    ].map(it => this.buildMetadataLine(it)).join('');
  }

  private static buildMetadataLine(line: string): string {
    return `${COMPILATION_METADATA_TOKENS.LINE_START}${line}${COMPILATION_METADATA_TOKENS.LINE_END}`;
  }

  private static buildCompilationMetadataForConfiguration(configuration: Configuration): CompilationConfigurationMetadata {
    return {
      kind: CompilationMetadataKind.Configuration,
      clawjectVersion: CONSTANTS.libraryVersion,
      beans: Array.from(configuration.beanRegister.elements).map(bean => ({
        classMemberName: bean.classMemberName,
        kind: bean.kind,
        qualifier: bean.qualifier,
        nestedProperty: bean.nestedProperty,
        primary: bean.primary,
      }))
    };
  }

  private static buildCompilationMetadataForComponent(component: Component): CompilationComponentMetadata {
    return {
      kind: CompilationMetadataKind.Component,
      clawjectVersion: CONSTANTS.libraryVersion,
      qualifier: null,
    };
  }
}
