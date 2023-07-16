import tsServer from 'typescript/lib/tsserverlibrary';
import { ClawjectDiagnostics } from './LanguageServiceReportBuilder';

export const isClawjectDiagnostics = (diagnostics: tsServer.Diagnostic): diagnostics is ClawjectDiagnostics => {
  // return /^CLAWJECT\d+$/.test(diagnostics.source ?? '');
  return Object.hasOwn(diagnostics, '___clawjectToken');
};


