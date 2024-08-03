import ts from 'typescript';
import { Dirty } from './Dirty';
import { ProgramStorage } from './ProgramStorage';
import transformer from '@clawject/core/transformer/index';

export class PluginCompiler {
  constructor(
    private programStorage: ProgramStorage,
  ) {}

  private printer = ts.createPrinter();
  private filesToCompile = new Set<string>();

  private transformDirtyMarker = new Dirty(5, async () => {
    await this.programStorage.refreshProgram();
    const compiled = await this.compile();
    this.transformPromise = null;
    this.filesToCompile.clear();

    return compiled;
  });
  private transformPromise: Promise<Map<string, string>> | null = null;

  async transform(fileName: string, content: string): Promise<string> {
    this.transformDirtyMarker.markDirty();
    await this.programStorage.updateFile(fileName, content);
    this.filesToCompile.add(fileName);
    if (!this.transformPromise) {
      this.transformPromise = this.transformDirtyMarker.waitClean();
    }
    const result = await this.transformPromise;

    return result.get(fileName) ?? content;
  }

  private async compile(): Promise<Map<string, string>> {
    const program = await this.programStorage.getProgram();
    const clawjectTransformer = transformer(program, undefined);
    const transformationResult = ts.transform(
      Array.from(this.filesToCompile).map(it => program.getSourceFile(it)).filter((it): it is ts.SourceFile => Boolean(it)),
      [clawjectTransformer],
      program.getCompilerOptions(),
    );

    const result = new Map<string, string>();
    transformationResult.transformed.forEach((sourceFile) => {
      result.set(sourceFile.fileName, this.printer.printFile(sourceFile));
    });

    return result;
  }
}
