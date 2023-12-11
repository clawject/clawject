import tsServer from 'typescript/lib/tsserverlibrary';

export class LanguageServiceCache {
  static readonly semanticDiagnosticsCache = new Map<string, tsServer.Diagnostic[]>();

  static getByFileName(fileName: string): tsServer.Diagnostic[] {
    return this.semanticDiagnosticsCache.get(fileName) ?? [];
  }

  static clearByFileName(fileName: string): void {
    this.semanticDiagnosticsCache.delete(fileName);
  }

  static clear(): void {
    this.semanticDiagnosticsCache.clear();
  }
}
