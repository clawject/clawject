import ts from 'typescript';
import { getCompilationContext } from './getCompilationContext';
import { BuildErrorFormatter } from '../compile-time/compilation-context/BuildErrorFormatter';
import { BaseTypesRepository } from '../compile-time/core/type-system/BaseTypesRepository';
import { verifyTSVersion } from './verifyTSVersion';
import { processAtomicMode } from '../compile-time/core/atomic-mode/processAtomicMode';
import { ConfigLoader } from '../compile-time/config/ConfigLoader';
import { processApplicationMode } from '../compile-time/core/application-mode/processApplicationMode';
import { cleanup } from '../compile-time/core/cleaner/cleanup';
import { DecoratorRules } from '../compile-time/core/decorator-processor/DecoratorRules';

const transformer = (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  const compilationContext = getCompilationContext();
  compilationContext.assignProgram(program);

  if (!compilationContext.languageServiceMode) {
    verifyTSVersion();
  }

  return context => sourceFile => {
    if (!compilationContext.languageServiceMode) {
      cleanup(sourceFile.fileName);
    }

    DecoratorRules.init();
    BaseTypesRepository.init();

    const mode = ConfigLoader.get().mode;
    let transformedSourceFile = sourceFile;

    switch (mode) {
    case 'application':
      transformedSourceFile = processApplicationMode(compilationContext, context, sourceFile);
      break;
    case 'atomic':
      transformedSourceFile = processAtomicMode(compilationContext, context, sourceFile);
      break;
    }

    if (!compilationContext.areErrorsHandled) {
      const message = BuildErrorFormatter.formatErrors(
        compilationContext.errors,
      );

      if (message !== null) {
        console.log(message);
        process.exit(1);
      }
    }

    return transformedSourceFile;
  };
};


//For webpack + ts-loader
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

  return transformer(programProxy);
};

export default transformer;
