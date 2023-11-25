import tsServer from 'typescript/lib/tsserverlibrary';
import { ClawjectTransformer } from '../transformer';
import { FileGraph } from '../compile-time/core/file-graph/FileGraph';
import { cleanup } from '../compile-time/core/cleaner/cleanup';
import { LanguageServiceCache } from './LanguageServiceCache';
import { ModificationTracker } from './ModificationTracker';

export class Compiler {
  static wasCompiled = false;
  static pluginInfo: tsServer.server.PluginCreateInfo | null = null;

  static assignPluginInfo(pluginInfo: tsServer.server.PluginCreateInfo): void {
    this.pluginInfo = pluginInfo;
  }

  static ensureCompiled(): void {
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

    affectedFiles.forEach(it => {
      cleanup(it);
      LanguageServiceCache.clearByFileName(it);
    });

    const affectedSourceFiles = program.getSourceFiles()
      .filter(it => affectedFiles.has(it.fileName));

    this.runCompilation(affectedSourceFiles, program);
  }

  private static runCompilation(sourceFiles: tsServer.SourceFile[], program: tsServer.Program): void {
    tsServer.transform(sourceFiles, [
      ClawjectTransformer(() => program as any) as any, // It's needed because of usage of ts-expose-internals
    ], program.getCompilerOptions());
  }
}
