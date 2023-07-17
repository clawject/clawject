import tsServer from 'typescript/lib/tsserverlibrary';
import { ClawjectTransformer } from '../transformer';
import { ModificationTrackerHolder } from './modification-tracker/ModificationTrackerHolder';
import { FileGraph } from '../compile-time/core/file-graph/FileGraph';
import { cleanup } from '../compile-time/core/cleaner/cleanup';
import { LanguageServiceReportBuilder } from './LanguageServiceReportBuilder';

export class Compiler {
  static wasCompiled = false;
  static pluginInfo: tsServer.server.PluginCreateInfo | null = null;
  static diagnosticsCache = new Map<string, tsServer.Diagnostic[]>();

  static assignPluginInfo(pluginInfo: tsServer.server.PluginCreateInfo): void {
    this.pluginInfo = pluginInfo;
  }

  static getSemanticDiagnostics(fileName: string): tsServer.Diagnostic[] {
    if (!this.pluginInfo) {
      return [];
    }

    const diagnostics = this.diagnosticsCache.get(fileName) ?? LanguageServiceReportBuilder.buildSemanticDiagnostics(this.pluginInfo, fileName);
    this.diagnosticsCache.set(fileName, diagnostics);

    return diagnostics;
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

    affectedFiles.forEach(it => {
      cleanup(it);
      this.diagnosticsCache.delete(it);
    });

    const affectedSourceFiles = program.getSourceFiles()
      .filter(it => affectedFiles.has(it.fileName));

    tsServer.transform(affectedSourceFiles, [
      ClawjectTransformer(() => program),
    ], program.getCompilerOptions());
  }
}
