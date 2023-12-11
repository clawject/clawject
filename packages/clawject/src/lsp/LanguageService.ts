import tsServer, { DiagnosticCategory } from 'typescript/lib/tsserverlibrary';
import { Compiler } from './Compiler';
import { LanguageServiceReportBuilder } from './LanguageServiceReportBuilder';
import { LanguageServiceCache } from './LanguageServiceCache';
import { CONSTANTS } from '../constants';

export class LanguageService {
  private static pluginInfo: tsServer.server.PluginCreateInfo | null = null;
  declare private static originalGetSemanticDiagnostics: tsServer.LanguageService['getSemanticDiagnostics'];
  static configFileErrors: string[] = [];

  static assignPluginInfo(pluginInfo: tsServer.server.PluginCreateInfo): void {
    this.pluginInfo = pluginInfo;
    this.originalGetSemanticDiagnostics = pluginInfo.languageService.getSemanticDiagnostics.bind(pluginInfo.languageService);
  }

  static getSemanticDiagnostics: tsServer.LanguageService['getSemanticDiagnostics'] = (fileName) => {
    const program = this.pluginInfo?.languageService.getProgram();

    if (!this.pluginInfo || !program) {
      return [];
    }

    const prior = this.originalGetSemanticDiagnostics(fileName);

    if (this.configFileErrors.length > 0) {
      return [
        ...prior,
        {
          category: DiagnosticCategory.Error,
          source: CONSTANTS.libraryName,
          start: 0,
          length: 1,
          file: this.pluginInfo.languageService.getProgram()?.getSourceFile(fileName),
          messageText: 'Configuration file errors: \n' + this.configFileErrors.join('\n'),
          code: 0,
        }
      ];
    }

    Compiler.ensureCompiled();

    let diagnostics = LanguageServiceCache.getByFileName(fileName);

    if (diagnostics.length === 0) {
      diagnostics = LanguageServiceReportBuilder.buildSemanticDiagnostics(fileName);
    }

    LanguageServiceCache.semanticDiagnosticsCache.set(fileName, diagnostics);

    return [
      ...prior,
      ...diagnostics,
    ];
  };
}
