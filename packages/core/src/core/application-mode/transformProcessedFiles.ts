import type ts from 'typescript';
import { Context } from '../../compilation-context/Context';
import { InternalsAccessBuilder } from '../internals-access/InternalsAccessBuilder';
import { Value } from '../utils/Value';
import { CONSTANTS } from '../../constants';
import { ApplicationRepository } from '../application/ApplicationRepository';
import { transformApplicationClassV2 } from './transformers/transformApplicationClassV2';

export const transformProcessedFiles = (
  tsContext: ts.TransformationContext,
  sourceFile: ts.SourceFile
): ts.SourceFile => {
  //Skipping declaration files
  if (sourceFile.isDeclarationFile) {
    return sourceFile;
  }
  const shouldAddInternalImport = new Value(false);
  InternalsAccessBuilder.setCurrentIdentifier(
    tsContext.factory.createUniqueName(CONSTANTS.libraryImportName)
  );

  const visitor = (node: ts.Node): ts.Node => {
    if (!Context.ts.isClassDeclaration(node)) {
      return Context.ts.visitEachChild(node, visitor, tsContext);
    }

    const application = ApplicationRepository.nodeToApplication.get(node) ?? null;
    if (!application) {
      return Context.ts.visitEachChild(node, visitor, tsContext);
    }

    shouldAddInternalImport.value = true;

    const transformed = transformApplicationClassV2(node, application);

    return Context.ts.visitEachChild(transformed, visitor, tsContext);
  };

  const transformedFile = Context.ts.visitNode(
    sourceFile,
    visitor
  ) as ts.SourceFile;

  if (Context.languageServiceMode) {
    return sourceFile;
  }

  const updatedStatements = Array.from(transformedFile.statements);

  // if (ConfigLoader.get().mode === 'development') {
  //   ApplicationRepository.applicationIdToApplication.forEach((application) => {
  //     if (
  //       application.additionalFilesToAddDevelopmentMetadata.has(
  //         transformedFile.fileName
  //       )
  //     ) {
  //       shouldAddInternalImport.value = true;
  //       const metadata = RuntimeMetadataBuilder.developmentApplicationMetadata(
  //         application.rootConfiguration,
  //         application
  //       );
  //
  //       updatedStatements.push(
  //         factory.createExpressionStatement(
  //           factory.createCallExpression(
  //             factory.createPropertyAccessExpression(
  //               InternalsAccessBuilder.internalPropertyAccessExpression(
  //                 InternalElementKind.ClawjectInternalRuntimeUtils
  //               ),
  //               factory.createIdentifier('defineDevelopmentApplicationMetadata')
  //             ),
  //             undefined,
  //             [
  //               valueToASTExpression(application.id),
  //               valueToASTExpression(Compiler.projectVersion),
  //               valueToASTExpression(metadata),
  //             ]
  //           )
  //         )
  //       );
  //     }
  //   });
  // }

  if (shouldAddInternalImport.value) {
    updatedStatements.unshift(
      InternalsAccessBuilder.importDeclarationToInternal()
    );
  }

  return Context.factory.updateSourceFile(
    sourceFile,
    updatedStatements,
    sourceFile.isDeclarationFile,
    sourceFile.referencedFiles,
    sourceFile.typeReferenceDirectives,
    sourceFile.hasNoDefaultLib,
    sourceFile.libReferenceDirectives
  );
};
