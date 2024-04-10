import tsServer from 'typescript/lib/tsserverlibrary';
import { DiagnosticsBuilder } from '../ts-diagnostics/DiagnosticsBuilder';

export class LanguageServiceReportBuilder {
  static buildSemanticDiagnostics(fileName: string): tsServer.Diagnostic[] {
    return DiagnosticsBuilder.getDiagnostics().filter(it => it.file?.fileName === fileName) as tsServer.Diagnostic[];
  }
}
