import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { processAtomicMode } from './processAtomicMode';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';

export const getTransformerFactory = (
    compilationContext: CompilationContext,
): ts.TransformerFactory<ts.SourceFile> => context => {
    return sourceFile => {
        compilationContext.clearMessagesByFilePath(sourceFile.fileName);
        ConfigurationRepository.clearByFileName(sourceFile.fileName);

        return processAtomicMode(compilationContext, context, sourceFile);
    };
};