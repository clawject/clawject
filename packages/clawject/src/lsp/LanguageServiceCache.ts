import tsServer from 'typescript/lib/tsserverlibrary';

export class LanguageServiceCache {
  static readonly semanticDiagnosticsCache = new Map<string, tsServer.Diagnostic[]>();

  static clearByFileName(fileName: string): void {
    this.semanticDiagnosticsCache.delete(fileName);
  }

  static clear(): void {
    this.semanticDiagnosticsCache.clear();
  }
}
