import type tsServer from 'typescript/lib/tsserverlibrary';
import { getCompilationContext } from '../transformer/getCompilationContext';
import { Compiler } from './Compiler';
import { LanguageServiceLogger } from './LanguageServiceLogger';
import { cleanupAll } from '../compile-time/core/cleaner/cleanup';

export function ClawjectLanguageServicePlugin(modules: {
  typescript: typeof import('typescript/lib/tsserverlibrary')
}) {
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

    const onDispose = () => {
      cleanupAll();
      Compiler.wasCompiled = false;
      Compiler.diagnosticsCache.clear();
    };

    proxy.cleanupSemanticCache = () => {
      info.languageService.cleanupSemanticCache();
      onDispose();
    };
    proxy.dispose = () => {
      info.languageService.dispose();
      onDispose();
    };

    proxy.getSemanticDiagnostics = (fileName): tsServer.Diagnostic[] => {
      const prior = info.languageService.getSemanticDiagnostics(fileName);

      Compiler.ensureCompiled();

      return [
        ...prior,
        ...Compiler.getSemanticDiagnostics(fileName),
      ];
    };

    return proxy;
  }

  return {create};
}