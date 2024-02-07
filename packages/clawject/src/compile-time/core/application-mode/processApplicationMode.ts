import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { InternalsAccessBuilder } from '../internals-access/InternalsAccessBuilder';
import { Value } from '../../../runtime/Value';
import { CONSTANTS } from '../../../constants/index';
import { processClassDeclaration } from './processClassDeclaration';
import { getDecoratorVerificationErrors } from '../decorator-processor/getDecoratorVerificationErrors';

export const processApplicationMode = (compilationContext: CompilationContext, tsContext: ts.TransformationContext, sourceFile: ts.SourceFile): ts.SourceFile => {
  //Skipping declaration files
  if (sourceFile.isDeclarationFile) {
    return sourceFile;
  }

  const shouldAddInternalImport = new Value(false);
  InternalsAccessBuilder.setCurrentIdentifier(tsContext.factory.createUniqueName(CONSTANTS.libraryImportName));

  const visitor = (node: ts.Node): ts.Node => {
    if (!ts.isClassDeclaration(node)) {
      return ts.visitEachChild(node, visitor, tsContext);
    }

    const decoratorVerificationErrors = getDecoratorVerificationErrors(node);

    //Skipping processing anything because of errors
    if (decoratorVerificationErrors.length !== 0) {
      decoratorVerificationErrors.forEach(it => compilationContext.report(it));
      return node;
    }

    const transformedNode = processClassDeclaration(node, shouldAddInternalImport);

    return ts.visitEachChild(transformedNode, visitor, tsContext);
  };

  const transformedFile = ts.visitNode(sourceFile, visitor) as ts.SourceFile;

  if (compilationContext.languageServiceMode) {
    return sourceFile;
  }

  const updatedStatements = Array.from(transformedFile.statements);

  if (shouldAddInternalImport.value) {
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
