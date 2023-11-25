import tsServer from 'typescript/lib/tsserverlibrary.js';
import { DiagnosticsBuilder } from '../compile-time/ts-diagnostics/DiagnosticsBuilder';

export class LanguageServiceReportBuilder {
  static buildSemanticDiagnostics(fileName: string): tsServer.Diagnostic[] {
    return DiagnosticsBuilder.getAllDiagnostics().filter(it => it.file?.fileName === fileName) as tsServer.Diagnostic[];
  }
}
