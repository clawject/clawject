import tsServer from 'typescript/lib/tsserverlibrary';
import { ClawjectDiagnostics } from './LanguageServiceReportBuilder';

export const isClawjectDiagnostics = (diagnostics: tsServer.Diagnostic): diagnostics is ClawjectDiagnostics => {
  // return typeof diagnostics.messageText === 'string' && /^CLAWJECT\d+:.*/.test(diagnostics.messageText);
  return Object.hasOwn(diagnostics, '___clawjectToken');
};


