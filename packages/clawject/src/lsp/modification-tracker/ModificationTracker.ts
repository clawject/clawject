import tsServer from 'typescript/lib/tsserverlibrary';

export class ModificationTracker {
  constructor(
    private info: tsServer.server.PluginCreateInfo,
  ) {}

  tryInit(): void {
    if (this.versions.size > 0) {
      return;
    }

    this.info.languageService.getProgram()?.getSourceFiles().forEach(sourceFile => {
      this.versions.set(sourceFile.fileName, this.info.project.getScriptVersion(sourceFile.fileName));
    });
  }

  //fileName to version
  private versions = new Map<string, string>();

  getModifiedFilesAndSetLatestVersions(): Set<string> {
    const result = new Set<string>();

    this.versions.forEach((oldVersion, fileName) => {
      const existsInProgram = Boolean(this.info.languageService.getProgram()?.getSourceFile(fileName));

      if (!existsInProgram) {
        this.versions.delete(fileName);
        result.add(fileName);

        return;
      }

      const newVersion = this.info.project.getScriptVersion(fileName);

      if (newVersion !== oldVersion) {
        result.add(fileName);
        this.versions.set(fileName, this.info.project.getScriptVersion(fileName));
      }
    });

    return result;
  }
}
