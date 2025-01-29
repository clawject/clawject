import type ts from 'typescript';
import type { TransformerExtras } from 'ts-patch';
import { verifyTSVersion } from './verifyTSVersion';
import { Compiler } from '../core/compiler/Compiler';
import { Context } from '../compilation-context/Context';
import { transformProcessedFiles } from '../core/application-mode/transformProcessedFiles';

/** @public */
const transformer = (program: ts.Program, config: unknown, transformerExtras?: TransformerExtras): ts.TransformerFactory<ts.SourceFile> => {
  if (transformerExtras) {
    Context.ts = transformerExtras.ts;
  }

  if (!Context.languageServiceMode) {
    verifyTSVersion();
  }

  return context => sourceFile => {
    Context.assignProgram(program);
    Context.assignFactory(context.factory);
    Compiler.compile(context, transformerExtras);

    const transformedSourceFile = transformProcessedFiles(context, sourceFile);

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
