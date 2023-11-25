import tsServer from 'typescript/lib/tsserverlibrary';

export class ModificationTracker {
  private static pluginInfo: tsServer.server.PluginCreateInfo | null = null;

  static assignPluginInfo(pluginInfo: tsServer.server.PluginCreateInfo): void {
    this.pluginInfo = pluginInfo;
  }

  static tryInit(): void {
    const pluginInfo = this.pluginInfo;
    if (this.versions.size > 0 || !pluginInfo) {
      return;
    }

    pluginInfo.languageService.getProgram()?.getSourceFiles().forEach(sourceFile => {
      this.versions.set(sourceFile.fileName, pluginInfo.project.getScriptVersion(sourceFile.fileName));
    });
  }

  //fileName to version
  private static versions = new Map<string, string>();

  static getModifiedFilesAndSetLatestVersions(): Set<string> {
    const pluginInfo = this.pluginInfo;

    if (!pluginInfo) {
      return new Set();
    }

    const result = new Set<string>();

    this.versions.forEach((oldVersion, fileName) => {
      const existsInProgram = Boolean(pluginInfo.languageService.getProgram()?.getSourceFile(fileName));

      if (!existsInProgram) {
        this.versions.delete(fileName);
        result.add(fileName);

        return;
      }

      const newVersion = pluginInfo.project.getScriptVersion(fileName);

      if (newVersion !== oldVersion) {
        result.add(fileName);
        this.versions.set(fileName, pluginInfo.project.getScriptVersion(fileName));
      }
    });

    return result;
  }

  static clear(): void {
    this.versions.clear();
  }
}
