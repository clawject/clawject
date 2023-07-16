import tsServer from 'typescript/lib/tsserverlibrary';
import { ClawjectTransformer } from '../transformer';
import { ModificationTrackerHolder } from './modification-tracker/ModificationTrackerHolder';
import { FileGraph } from '../compile-time/core/file-graph/FileGraph';
import { cleanup } from '../compile-time/core/cleaner/cleanup';
import { LanguageServiceLogger } from './LanguageServiceLogger';

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
      tsServer.transform(Array.from(program.getSourceFiles()), [
        ClawjectTransformer(() => program),
      ], program.getCompilerOptions());
      return;
    }

    const modificationTracker = ModificationTrackerHolder.getForProject(pluginInfo.project.getProjectName(), pluginInfo);
    const modifiedFiles = modificationTracker.getModifiedFilesAndSetLatestVersions();
    const affectedFiles = FileGraph.getRelatedFileNamesWithTarget(Array.from(modifiedFiles));

    LanguageServiceLogger.log('Affected files: ' + '\n' + Array.from(affectedFiles).join('\n'));

    affectedFiles.forEach(cleanup);

    const affectedSourceFiles = program.getSourceFiles()
      .filter(it => affectedFiles.has(it.fileName));

    tsServer.transform(affectedSourceFiles, [
      ClawjectTransformer(() => program),
    ], program.getCompilerOptions());
  }
}
