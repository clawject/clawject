import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { processContexts } from './processContexts';
import { ContextRepository } from '../context/ContextRepository';

export const getTransformerFactory = (
    compilationContext: CompilationContext,
): ts.TransformerFactory<ts.SourceFile> => context => {
    return sourceFile => {
        compilationContext.clearMessagesByFilePath(sourceFile.fileName);
        ContextRepository.clearByFileName(sourceFile.fileName);

        return processContexts(compilationContext, context, sourceFile);
    };
};
