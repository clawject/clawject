import tsServer from 'typescript/lib/tsserverlibrary';
import { LanguageServiceLogger } from './LanguageServiceLogger';
import { LanguageService } from './LanguageService';
import { isTSVersionValid } from '../ts-version/isTSVersionValid';
import { disposeLanguageService } from './disposeLanguageService';
import { Context } from '../compilation-context/Context';
import { ConfigLoader } from '../config/ConfigLoader';

export function ClawjectLanguageServicePlugin(modules: {
  typescript: typeof import('typescript/lib/tsserverlibrary')
}) {
  const tsServer = modules.typescript;
  Context.ts = tsServer as any;
  Context.languageServiceMode = true;
  Context.areErrorsHandled = true;

  function create(info: tsServer.server.PluginCreateInfo) {
    LanguageServiceLogger.assignPluginInfo(info);
    LanguageService.assignPluginInfo(info);
    Context.assignCancellationToken(() => info.languageServiceHost.getCancellationToken?.().isCancellationRequested() ?? false);

    let fileWatcher: tsServer.FileWatcher | undefined = undefined;

    const fileWatcherCallback: tsServer.FileWatcherCallback = (fileName, eventKind) => {
      if (eventKind === tsServer.FileWatcherEventKind.Deleted) {
        fileWatcher?.close();
      }

      disposeLanguageService();
    };

    ConfigLoader.onConfigLoaded = (configFileName: string) => {
      LanguageServiceLogger.log('Config loaded, fileName: ' + configFileName);
      fileWatcher?.close();

      fileWatcher = info.serverHost.watchFile(configFileName, fileWatcherCallback);
      disposeLanguageService();
    };
    LanguageServiceLogger.log('Clawject language service plugin created');

    if (!isTSVersionValid(tsServer.version)) {
      LanguageServiceLogger.log(
        'language service plugin disabled due to unsupported TypeScript version'
      );
      return info.languageService;
    }

    return decorateLanguageService(info, {
      cleanupSemanticCache: () => {
        info.languageService.cleanupSemanticCache();
        disposeLanguageService();
      },
      dispose: () => {
        info.languageService.dispose();
        disposeLanguageService();
      },
      getSemanticDiagnostics: LanguageService.getSemanticDiagnostics,
    });
  }

  return {create};
}

function decorateLanguageService(info: tsServer.server.PluginCreateInfo, object: Partial<tsServer.LanguageService>): tsServer.LanguageService {
  const proxy: tsServer.LanguageService = Object.create(null);
  for (const k of Object.keys(info.languageService)) {
    const x = info.languageService[k]!;
    proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
  }

  for (const k of Object.keys(object)) {
    proxy[k] = object[k];
  }

  return proxy;
}
