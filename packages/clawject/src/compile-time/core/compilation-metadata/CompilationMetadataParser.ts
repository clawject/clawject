import { CompilationMetadata, CompilationMetadataKind } from './models/CompilationMetadata';
import { COMPILATION_METADATA_TOKENS } from './constants';

export class CompilationMetadataParser {
  private static METADATA_KINDS = Object.values(CompilationMetadataKind);

  static parse(metadata: string): CompilationMetadata | null {
    try {
      return this._parse(metadata);
    } catch (e) {
      return null;
    }
  }

  private static _parse(metadata: string): CompilationMetadata {
    const lines = metadata.split('\n').map(it => this.parseLine(it)).filter(it => it);

    if (lines[0] !== COMPILATION_METADATA_TOKENS.HEADER) {
      throw new Error('Invalid metadata header');
    }
    const object = JSON.parse(lines[1]);

    if (this.METADATA_KINDS.includes(object.kind)) {
      return object;
    }

    throw new Error('Invalid metadata kind');
  }

  private static parseLine(line: string): string {
    const regexp = /^\* (.+) \*$/;
    const matched = line.match(regexp);

    if (!matched) {
      return '';
    }

    return matched[1] || '';
  }
}
