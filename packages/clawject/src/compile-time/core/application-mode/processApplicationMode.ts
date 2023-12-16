import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { InternalsAccessBuilder } from '../internals-access/InternalsAccessBuilder';
import { Value } from '../../../runtime/Value';
import { CONSTANTS } from '../../../constants/index';
import { processClassDeclaration } from './processClassDeclaration';

export const processApplicationMode = (compilationContext: CompilationContext, tsContext: ts.TransformationContext, sourceFile: ts.SourceFile): ts.SourceFile => {
  //Skipping declaration files
  if (sourceFile.isDeclarationFile) {
    return sourceFile;
  }

  const shouldAddInternalImport = new Value(false);
  InternalsAccessBuilder.setCurrentIdentifier(tsContext.factory.createUniqueName(CONSTANTS.libraryImportName));

  const visitor = (node: ts.Node): ts.Node => {
    if (ts.isClassDeclaration(node)) {
      return processClassDeclaration(node);
    }

    return ts.visitEachChild(node, visitor, tsContext);
  };

  const transformedFile = ts.visitNode(sourceFile, visitor) as ts.SourceFile;

  const updatedStatements = Array.from(transformedFile.statements);

  if (shouldAddInternalImport.value) {
    updatedStatements.unshift(InternalsAccessBuilder.importDeclarationToInternal());
  }

  if (compilationContext.languageServiceMode) {
    return sourceFile;
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
