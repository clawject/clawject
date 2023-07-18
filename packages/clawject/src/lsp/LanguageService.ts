import tsServer from 'typescript/lib/tsserverlibrary';
import { Compiler } from './Compiler';
import { LanguageServiceReportBuilder } from './LanguageServiceReportBuilder';
import { LanguageServiceCache } from './LanguageServiceCache';

export class LanguageService {
  private static pluginInfo: tsServer.server.PluginCreateInfo | null = null;

  static assignPluginInfo(pluginInfo: tsServer.server.PluginCreateInfo): void {
    this.pluginInfo = pluginInfo;
  }

  static getSemanticDiagnostics = (fileName): tsServer.Diagnostic[] => {
    if (!this.pluginInfo) {
      return [];
    }

    const prior = this.pluginInfo.languageService.getSemanticDiagnostics(fileName);

    Compiler.ensureCompiled();

    const diagnostics = LanguageServiceCache.semanticDiagnosticsCache.get(fileName) ?? LanguageServiceReportBuilder.buildSemanticDiagnostics(this.pluginInfo, fileName);
    LanguageServiceCache.semanticDiagnosticsCache.set(fileName, diagnostics);

    return [
      ...prior,
      ...diagnostics,
    ];
  };
}
