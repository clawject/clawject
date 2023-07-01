import ts from 'typescript';
import { isExtendsClassFromLibrary } from '../ts/predicates/isExtendsClassFromLibrary';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { InternalsAccessBuilder } from '../internals-access/InternalsAccessBuilder';
import { processCatContext } from './processCatContext';
import { processImplicitComponents } from './processImplicitComponents';

export const processAtomicMode = (compilationContext: CompilationContext, tsContext: ts.TransformationContext, sourceFile: ts.SourceFile): ts.SourceFile => {
    //Skipping declaration files
    if (sourceFile.isDeclarationFile) {
        return sourceFile;
    }

    let shouldAddImports = false;

    const visitor = (node: ts.Node): ts.Node => {
        if (!ts.isClassDeclaration(node)) {
            return ts.visitEachChild(node, visitor, tsContext);
        }

        //Registering contexts
        if (isExtendsClassFromLibrary(node, 'CatContext')) {
            shouldAddImports = true;

            return processCatContext(node, visitor, compilationContext, tsContext);
        }

        return processImplicitComponents(node, visitor, compilationContext, tsContext);
    };

    const transformedFile = ts.visitNode(sourceFile, visitor);

    const updatedStatements = Array.from(transformedFile.statements);

    if (shouldAddImports) {
        updatedStatements.unshift(InternalsAccessBuilder.importDeclarationToInternal());
    }

    return ts.factory.updateSourceFile(
        sourceFile,
        updatedStatements,
        sourceFile.isDeclarationFile,
        sourceFile.referencedFiles,
        sourceFile.typeReferenceDirectives,
        sourceFile.hasNoDefaultLib,
        sourceFile.libReferenceDirectives,
    );
};
