import tsServer from 'typescript/lib/tsserverlibrary';
import { ConfigurationRepository } from '../compile-time/core/configuration/ConfigurationRepository';
import { getCompilationContext } from '../transformer/getCompilationContext';
import ClawjectTransformer from '../transformer';
import { ModificationTrackerHolder } from './modification-tracker/ModificationTrackerHolder';

export class Compiler {
  static wasCompiled = false;
  static pluginInfo: tsServer.server.PluginCreateInfo | null = null;

  static ensureCompiled(): void {
    if (!this.pluginInfo) {
      return;
    }

    const program = this.pluginInfo?.languageService.getProgram();

    if (!program) {
      return;
    }

    const modificationTracker = ModificationTrackerHolder.getForProject(this.pluginInfo.project.getProjectName(), this.pluginInfo);
    const modifiedFiles = modificationTracker.getModifiedFilesAndSetLatestVersions();

    if (modifiedFiles.size === 0 && this.wasCompiled) {
      return;
    }

    this.wasCompiled = true;

    modifiedFiles.forEach(modifiedFile => {
      ConfigurationRepository.fileNameToConfigurations.get(modifiedFile)
        ?.forEach(configuration => {
          configuration.relatedPaths.forEach(path => {
            ConfigurationRepository.clearByFileName(path);
            getCompilationContext().clearMessagesByFileName(path);
          });
        });

      ConfigurationRepository.clearByFileName(modifiedFile);
      getCompilationContext().clearMessagesByFileName(modifiedFile);
    });

    const sourceFiles = program.getSourceFiles()
      .filter(it => modifiedFiles.has(it.fileName));

    tsServer.transform(sourceFiles, [
      ClawjectTransformer(program),
    ], program.getCompilerOptions());
  }
}
