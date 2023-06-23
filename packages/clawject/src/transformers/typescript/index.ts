import ts from 'typescript';
import ClawjectWebpackPlugin from '../../plugins/webpack';
import { get } from 'lodash';
import { getCompilationContext } from '../getCompilationContext';
import { BuildErrorFormatter } from '../../compilation-context/BuildErrorFormatter';
import { BaseTypesRepository } from '../../core/type-system/BaseTypesRepository';
import { verifyTSVersion } from '../verifyTSVersion';
import { ConfigurationRepository } from '../../core/configuration/ConfigurationRepository';
import { processAtomicMode } from '../../core/build-context/processAtomicMode';
import { ConfigLoader } from '../../config/ConfigLoader';
import { processApplicationMode } from '../../core/application-mode/processApplicationMode';

verifyTSVersion();

export default (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
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
