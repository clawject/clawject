import ts from 'typescript';
import ClawjectWebpackPlugin from '../plugins/webpack';
import { get } from 'lodash';
import { getCompilationContext } from './getCompilationContext';
import { BuildErrorFormatter } from '../compilation-context/BuildErrorFormatter';
import { BaseTypesRepository } from '../core/type-system/BaseTypesRepository';
import { verifyTSVersion } from './verifyTSVersion';
import { ConfigurationRepository } from '../core/configuration/ConfigurationRepository';
import { processAtomicMode } from '../core/build-context/processAtomicMode';
import { ConfigLoader } from '../config/ConfigLoader';
import { processApplicationMode } from '../core/application-mode/processApplicationMode';

const transformer = (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
    verifyTSVersion();

    const compilationContext = getCompilationContext();
    compilationContext.assignProgram(program);

    return context => sourceFile => {
        compilationContext.clearMessagesByFilePath(sourceFile.fileName);
        ConfigurationRepository.clearByFileName(sourceFile.fileName);
        BaseTypesRepository.init();

        const mode = ConfigLoader.get().mode;
        let transformedSourceFile: ts.SourceFile;

        switch (mode) {
        case 'application':
            transformedSourceFile = processApplicationMode(compilationContext, context, sourceFile);
            break;
        case 'atomic':
            transformedSourceFile = processAtomicMode(compilationContext, context, sourceFile);
            break;
        default:
            transformedSourceFile = sourceFile;
        }

        if (!get(ClawjectWebpackPlugin, 'isErrorsHandledByWebpack')) {
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
