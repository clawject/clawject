import type * as ts from 'typescript';
import { Context } from '../../compilation-context/Context';
import { InternalsAccessBuilder } from '../internals-access/InternalsAccessBuilder';
import { processClassDeclaration } from './processClassDeclaration';
import { getDecoratorVerificationErrors } from './getDecoratorVerificationErrors';
import { Logger } from '../../logger/Logger';
import { Value } from '../utils/Value';
import { CONSTANTS } from '../../constants/index';

export const processApplicationMode = (tsContext: ts.TransformationContext, sourceFile: ts.SourceFile): ts.SourceFile => {
  //Skipping declaration files
  if (sourceFile.isDeclarationFile) {
    return sourceFile;
  }

  const shouldAddInternalImport = new Value(false);
  InternalsAccessBuilder.setCurrentIdentifier(tsContext.factory.createUniqueName(CONSTANTS.libraryImportName));

  const visitor = (node: ts.Node): ts.Node => {
    if (!Context.ts.isClassDeclaration(node)) {
      return Context.ts.visitEachChild(node, visitor, tsContext);
    }

    const label = `Get decorator verification errors, file: ${sourceFile.fileName}, nodeName: "${node.name?.getText()}"`;
    Logger.verboseDuration(label);
    const decoratorVerificationErrors = getDecoratorVerificationErrors(node);
    Logger.verboseDuration(label);

    //Skipping processing anything because of errors
    if (decoratorVerificationErrors.length !== 0) {
      decoratorVerificationErrors.forEach(it => Context.report(it));
      return node;
    }

    const transformedNode = processClassDeclaration(node, shouldAddInternalImport);

    return Context.ts.visitEachChild(transformedNode, visitor, tsContext);
  };

  const transformedFile = Context.ts.visitNode(sourceFile, visitor) as ts.SourceFile;

  if (Context.languageServiceMode) {
    return sourceFile;
  }

  const updatedStatements = Array.from(transformedFile.statements);

  if (shouldAddInternalImport.value) {
    updatedStatements.unshift(InternalsAccessBuilder.importDeclarationToInternal());
  }

  return Context.factory.updateSourceFile(
    sourceFile,
    updatedStatements,
    sourceFile.isDeclarationFile,
    sourceFile.referencedFiles,
    sourceFile.typeReferenceDirectives,
    sourceFile.hasNoDefaultLib,
    sourceFile.libReferenceDirectives,
  );
};
