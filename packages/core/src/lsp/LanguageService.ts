import { Compiler } from '../core/compiler/Compiler';
import tsServer, { DiagnosticCategory } from 'typescript/lib/tsserverlibrary';
import { CONSTANTS } from '../constants';
import { Context } from '../compilation-context/Context';
import { DiagnosticsBuilder } from '../ts-diagnostics/DiagnosticsBuilder';
import { ConfigLoader } from '../config/ConfigLoader';

export class LanguageService {
  public static pluginInfo: tsServer.server.PluginCreateInfo | null = null;
  declare private static originalGetSemanticDiagnostics: tsServer.LanguageService['getSemanticDiagnostics'];

  static assignPluginInfo(pluginInfo: tsServer.server.PluginCreateInfo): void {
    this.pluginInfo = pluginInfo;
    this.originalGetSemanticDiagnostics = pluginInfo.languageService.getSemanticDiagnostics.bind(pluginInfo.languageService);
  }

  static getSemanticDiagnostics: tsServer.LanguageService['getSemanticDiagnostics'] = (fileName) => {
    const program = this.pluginInfo?.languageService.getProgram();

    if (!this.pluginInfo || !program) {
      return [];
    }

    this.assignContext(this.pluginInfo);

    const prior = this.originalGetSemanticDiagnostics(fileName);

    if (ConfigLoader.configFileErrors.length > 0) {
      return [
        ...prior,
        {
          category: DiagnosticCategory.Error,
          source: CONSTANTS.libraryName,
          start: 0,
          length: 1,
          file: this.pluginInfo.languageService.getProgram()?.getSourceFile(fileName),
          messageText: 'Configuration file errors: \n' + ConfigLoader.configFileErrors.join('\n'),
          code: 0,
        }
      ];
    }

    Compiler.compile(undefined, undefined);

    const diagnostics = DiagnosticsBuilder.getDiagnostics(fileName) as tsServer.Diagnostic[];

    return [
      ...prior,
      ...diagnostics,
    ];
  };

  private static assignContext(pluginInfo: tsServer.server.PluginCreateInfo): void {
    const program = pluginInfo.languageService.getProgram();

    if (!program) {
      return;
    }

    Context.assignProgram(program as any);
  }
}
