import type tsServer from 'typescript/lib/tsserverlibrary';
import { getCompilationContext } from '../transformer/getCompilationContext';
import { LanguageServiceReportBuilder } from './LanguageServiceReportBuilder';
import { isClawjectDiagnostics } from './utils';
import { Compiler } from './Compiler';
import { LanguageServiceLogger } from './LanguageServiceLogger';
import { cleanupAll } from '../compile-time/core/cleaner/cleanup';
import { MessageCode } from '../compile-time/compilation-context/messages/MessageCode';

export function ClawjectLanguageServicePlugin(modules: { typescript: typeof import('typescript/lib/tsserverlibrary') }) {
  const tsServer = modules.typescript;
  const compilationContext = getCompilationContext();
  compilationContext.languageServiceMode = true;
  compilationContext.areErrorsHandled = true;

  function create(info: tsServer.server.PluginCreateInfo) {
    info.project.projectService.logger.info(
      'Clawject language service plugin created'
    );

    Compiler.assignPluginInfo(info);
    LanguageServiceLogger.assignPluginInfo(info);

    // Set up decorator object
    const proxy: tsServer.LanguageService = Object.create(null);
    for (const k of Object.keys(info.languageService) as Array<keyof tsServer.LanguageService>) {
      const x = info.languageService[k]!;
      // @ts-expect-error - JS runtime trickery which is tricky to type tersely
      proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
    }

    proxy.cleanupSemanticCache = () => {
      cleanupAll();
    };

    proxy.getSemanticDiagnostics = (fileName): tsServer.Diagnostic[] => {
      const program = info.languageService.getProgram();
      const sourceFile = program?.getSourceFile(fileName);
      const prior = info.languageService.getSemanticDiagnostics(fileName);

      if (!program || !sourceFile) {
        return prior;
      }

      Compiler.ensureCompiled();

      return [
        ...prior,
        ...LanguageServiceReportBuilder.buildSemanticDiagnostics(info, fileName),
      ];
    };

    return proxy;
  }

  return { create };
}
