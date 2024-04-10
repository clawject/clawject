import tsServer from 'typescript/lib/tsserverlibrary';
import { ClawjectTransformer } from '../transformer';
import { ModificationTracker } from './ModificationTracker';
import { LanguageServiceLogger } from './LanguageServiceLogger';
import { disposeLanguageService } from './disposeLanguageService';
import { FileGraph } from '../core/file-graph/FileGraph';
import { cleanup } from '../core/cleaner/cleanup';

export class Compiler {
  static wasCompiled = false;
  static pluginInfo: tsServer.server.PluginCreateInfo | null = null;

  static assignPluginInfo(pluginInfo: tsServer.server.PluginCreateInfo): void {
    this.pluginInfo = pluginInfo;
  }

  static ensureCompiled(): void {
    try {
      this._ensureCompiled();
    } catch (error) {
      LanguageServiceLogger.log('Error during compilation', error);
      disposeLanguageService();
    }
  }

  private static _ensureCompiled(): void {
    const pluginInfo = this.pluginInfo;
    if (!pluginInfo) {
      return;
    }

    const program = pluginInfo.languageService.getProgram();

    if (!program) {
      return;
    }

    if (!this.wasCompiled) {
      this.wasCompiled = true;
      this.runCompilation(Array.from(program.getSourceFiles()), program);
      return;
    }

    ModificationTracker.tryInit();

    const modifiedFiles = ModificationTracker.getModifiedFilesAndSetLatestVersions();
    const affectedFiles = FileGraph.getRelatedFileNamesWithTarget(Array.from(modifiedFiles));

    affectedFiles.forEach(cleanup);

    const affectedSourceFiles = program.getSourceFiles()
      .filter(it => affectedFiles.has(it.fileName));

    this.runCompilation(affectedSourceFiles, program);
  }

  private static runCompilation(sourceFiles: tsServer.SourceFile[], program: tsServer.Program): void {
    try {
      tsServer.transform(sourceFiles, [
        ClawjectTransformer(() => program as any) as any, // It's needed because of usage of ts-expose-internals
      ], program.getCompilerOptions());
    } catch (error) {
      LanguageServiceLogger.log('Error during compilation', error);
      disposeLanguageService();
    }
  }
}
