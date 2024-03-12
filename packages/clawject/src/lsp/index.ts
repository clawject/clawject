import type tsServer from 'typescript/lib/tsserverlibrary';
import { getCompilationContext } from '../transformer/getCompilationContext';
import { Compiler } from './Compiler';
import { LanguageServiceLogger } from './LanguageServiceLogger';
import { LanguageService } from './LanguageService';
import { ModificationTracker } from './ModificationTracker';
import { isTSVersionValid } from '../ts-version/isTSVersionValid';
import { ConfigLoader } from '../compile-time/config/ConfigLoader';
import { disposeLanguageService } from './disposeLanguageService';

export function ClawjectLanguageServicePlugin(modules: {
  typescript: typeof import('typescript/lib/tsserverlibrary')
}) {
  const tsServer = modules.typescript;
  const compilationContext = getCompilationContext();
  compilationContext.languageServiceMode = true;
  compilationContext.areErrorsHandled = true;

  function create(info: tsServer.server.PluginCreateInfo) {
    LanguageServiceLogger.assignPluginInfo(info);
    Compiler.assignPluginInfo(info);
    ModificationTracker.assignPluginInfo(info);
    LanguageService.assignPluginInfo(info);
    getCompilationContext().assignCancellationToken(() => info.languageServiceHost.getCancellationToken?.().isCancellationRequested() ?? false);

    LanguageServiceLogger.log('Clawject language service plugin created');

    let fileWatcher: tsServer.FileWatcher | undefined = undefined;

    const fileWatcherCallback: tsServer.FileWatcherCallback = (fileName, eventKind, modifiedTime) => {
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
      // Find references is not called
      // findReferences(fileName: string, position: number): ts.ReferencedSymbol[] | undefined {
      //   Compiler.ensureCompiled();
      //   const original = info.languageService.findReferences(fileName, position) ?? [];
      //
      //   const applications = (Array.from(ApplicationRepository.fileNameToApplications.values()) ?? []).flat();
      //   const application = applications[0];
      //
      //   if (!application) {
      //     return original;
      //   }
      //
      //   const references: ts.ReferencedSymbol[] = [];
      //
      //   application.beans.forEach(bean => {
      //     if (!bean.nodeDetails.positionInRange(position)) {
      //       return;
      //     }
      //
      //     const baseDefinition = ts.GoToDefinition.createDefinitionInfo(
      //       bean.node.symbol.valueDeclaration!,
      //       getCompilationContext().typeChecker,
      //       bean.node.symbol,
      //       bean.node,
      //     );
      //     const beanDefinitionInfo: ts.ReferencedSymbolDefinitionInfo = {
      //       ...baseDefinition,
      //       displayParts: ts.nodeToDisplayParts(bean.node, bean.node.parent),
      //     };
      //     const beanReferences: ReferencedSymbolEntry[] = [];
      //
      //     const beanReferencesDependencies = Array.from(application.resolvedBeanDependencies.entries())
      //       .filter(([it, deps]) => it !== bean)
      //       .map(([it, deps]) => deps)
      //       .flat()
      //       .filter(it => it.qualifiedBean === bean);
      //
      //     if (beanReferencesDependencies.length === 0) {
      //       return;
      //     }
      //
      //     beanReferencesDependencies.forEach(dep => {
      //       const dependency = dep.dependency;
      //
      //       const reference: ts.ReferencedSymbolEntry = {
      //         textSpan: {
      //           start: dependency.nodeDetails.startOffset,
      //           length: dependency.nodeDetails.length,
      //         },
      //         fileName: dependency.node.getSourceFile().fileName,
      //         isWriteAccess: false,
      //         isDefinition: false,
      //       };
      //
      //       beanReferences.push(reference);
      //     });
      //
      //
      //     if (beanReferences.length !== 0) {
      //       references.push({
      //         definition: beanDefinitionInfo,
      //         references: beanReferences,
      //       });
      //     }
      //   });
      //
      //   LanguageServiceLogger.log('findReferences', references);
      //
      //   return [
      //     ...original,
      //     ...references,
      //   ];
      // },
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
