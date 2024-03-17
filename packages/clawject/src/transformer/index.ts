import ts from 'typescript';
import type { TransformerExtras } from 'ts-patch';
import { verifyTSVersion } from './verifyTSVersion';
import { processApplicationMode } from '../compile-time/core/application-mode/processApplicationMode';
import { cleanup, cleanupAll } from '../compile-time/core/cleaner/cleanup';
import { DecoratorRules } from '../compile-time/core/decorator-processor/DecoratorRules';
import { DiagnosticsBuilder } from '../compile-time/ts-diagnostics/DiagnosticsBuilder';
import { getCompilationContext } from './getCompilationContext';
import { Logger } from '../compile-time/logger/Logger';
import { compact } from 'lodash';

/** @public */
const transformer = (program: ts.Program, config: unknown, transformerExtras?: TransformerExtras): ts.TransformerFactory<ts.SourceFile> => {
  if (process.env['CLAWJECT_TEST_MODE'] === 'true') {
    //Needed to clean up state between tests
    cleanupAll();
  }

  const compilationContext = getCompilationContext();

  if (!compilationContext.languageServiceMode) {
    verifyTSVersion();
  }

  return context => sourceFile => {
    compilationContext.assignProgram(program);
    compilationContext.assignContextualFileName(sourceFile.fileName);
    cleanup(sourceFile.fileName);

    DecoratorRules.init();

    const t0 = Date.now();
    const transformedSourceFile = processApplicationMode(compilationContext, context, sourceFile);
    const t1 = Date.now();
    Logger.debug('File: ' + sourceFile.fileName + ' processed in ' + (t1 - t0) + 'ms');

    if (!compilationContext.areErrorsHandled) {
      const addDiagnostics = transformerExtras?.addDiagnostic;

      if (addDiagnostics) {
        const semanticDiagnostics = DiagnosticsBuilder.getDiagnostics(sourceFile.fileName);

        semanticDiagnostics.forEach(it => {
          transformerExtras?.addDiagnostic(it);
        });
      } else if (compilationContext.errors.length > 0) {
        //Falling back to throwing error from the compiler,
        // if ts-patch is not used - in watch mode it will finish a process
        const errors = getCompilationContext().errors;

        if (errors.length > 0) {
          const mapped = compact(errors.map(it => DiagnosticsBuilder.compilationMessageToDiagnostic(it)));
          const formatted = DiagnosticsBuilder.diagnosticsToString(mapped);

          console.log(formatted);
          process.exit(1);
        }
      }
    }

    compilationContext.assignContextualFileName(null);

    return transformedSourceFile;
  };
};


//For webpack + ts-loader
/** @public */
export const ClawjectTransformer = (programGetter: () => ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  const target = {} as ts.Program;

  const programProxy = new Proxy(target, {
    get(target: ts.Program, p: string | symbol, receiver: any): any {
      return programGetter()[p];
    },
    set(target: ts.Program, p: string | symbol, newValue: any, receiver: any): boolean {
      throw Error('ts.Program\'s methods are readonly');
    }
  });

  return transformer(programProxy, undefined);
};

/** @public */
export default transformer;
