import ts from 'typescript';
import { getCompilationContext } from './getCompilationContext';
import { BuildErrorFormatter } from '../compile-time/compilation-context/BuildErrorFormatter';
import { BaseTypesRepository } from '../compile-time/core/type-system/BaseTypesRepository';
import { verifyTSVersion } from './verifyTSVersion';
import { ConfigurationRepository } from '../compile-time/core/configuration/ConfigurationRepository';
import { processAtomicMode } from '../compile-time/core/atomic-mode/processAtomicMode';
import { ConfigLoader } from '../compile-time/config/ConfigLoader';
import { processApplicationMode } from '../compile-time/core/application-mode/processApplicationMode';
import { ComponentRepository } from '../compile-time/core/component/ComponentRepository';

const transformer = (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
    verifyTSVersion();

    const compilationContext = getCompilationContext();
    compilationContext.assignProgram(program);

    return context => sourceFile => {
        compilationContext.clearMessagesByFilePath(sourceFile.fileName);
        ConfigurationRepository.clearByFileName(sourceFile.fileName);
        ComponentRepository.clearByFileName(sourceFile.fileName);
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

        if (!compilationContext.isErrorsHandled) {
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
