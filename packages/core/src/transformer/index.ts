import type * as ts from 'typescript';
import type { TransformerExtras } from 'ts-patch';
import { verifyTSVersion } from './verifyTSVersion';
import { compact } from 'lodash';
import { cleanup, cleanupAll } from '../core/cleaner/cleanup';
import { Context } from '../compilation-context/Context';
import { processApplicationMode } from '../core/application-mode/processApplicationMode';
import { Logger } from '../logger/Logger';
import { DiagnosticsBuilder } from '../ts-diagnostics/DiagnosticsBuilder';

/** @public */
const transformer = (program: ts.Program, config: unknown, transformerExtras?: TransformerExtras): ts.TransformerFactory<ts.SourceFile> => {
  if (transformerExtras) {
    Context.ts = transformerExtras.ts;
  }

  if (process.env['CLAWJECT_TEST_MODE'] === 'true') {
    //Needed to clean up state between tests
    cleanupAll();
  }

  if (!Context.languageServiceMode) {
    verifyTSVersion();
  }

  return context => sourceFile => {
    Context.assignProgram(program);
    Context.assignContextualFileName(sourceFile.fileName);
    Context.assignFactory(context.factory);
    cleanup(sourceFile.fileName);

    const t0 = Date.now();
    const transformedSourceFile = processApplicationMode(context, sourceFile);
    const t1 = Date.now();
    Logger.debug('File: ' + sourceFile.fileName + ' processed in ' + (t1 - t0) + 'ms');

    if (!Context.areErrorsHandled) {
      const addDiagnostics = transformerExtras?.addDiagnostic;

      if (addDiagnostics) {
        const semanticDiagnostics = DiagnosticsBuilder.getDiagnostics(sourceFile.fileName);

        semanticDiagnostics.forEach(it => {
          transformerExtras?.addDiagnostic(it);
        });
      } else if (Context.errors.length > 0) {
        //Falling back to throwing error from the compiler,
        // if ts-patch is not used - in watch mode it will finish a process
        const errors = Context.errors;

        if (errors.length > 0) {
          const mapped = compact(errors.map(it => DiagnosticsBuilder.compilationMessageToDiagnostic(it)));
          const formatted = DiagnosticsBuilder.diagnosticsToString(mapped);

          console.log(formatted);
          process.exit(1);
        }
      }
    }

    Context.assignContextualFileName(null);

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
