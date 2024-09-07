import type * as ts from 'typescript';
import { Context } from '../../compilation-context/Context';
import { InternalElementKind, InternalsAccessBuilder } from '../internals-access/InternalsAccessBuilder';
import { Logger } from '../../logger/Logger';
import { Value } from '../utils/Value';
import { CONSTANTS } from '../../constants/index';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { ApplicationRepository } from '../application/ApplicationRepository';
import { processImplicitComponents } from './processImplicitComponents';
import { transformConfigurationOrApplicationClass } from './transformers/transformConfigurationOrApplicationClass';
import { ConfigLoader } from '../../config/ConfigLoader';
import { RuntimeMetadataBuilder } from './transformers/RuntimeMetadataBuilder';
import { compact } from 'lodash';
import { valueToASTExpression } from '../ts/utils/valueToASTExpression';
import { Compiler } from '../compiler/Compiler';

export const processApplicationMode = (tsContext: ts.TransformationContext, sourceFile: ts.SourceFile): ts.SourceFile => {
  //Skipping declaration files
  if (sourceFile.isDeclarationFile) {
    return sourceFile;
  }
  const factory = Context.factory;

  const shouldAddInternalImport = new Value(false);
  InternalsAccessBuilder.setCurrentIdentifier(tsContext.factory.createUniqueName(CONSTANTS.libraryImportName));

  const visitor = (node: ts.Node): ts.Node => {
    if (!Context.ts.isClassDeclaration(node)) {
      return Context.ts.visitEachChild(node, visitor, tsContext);
    }

    const configuration = ConfigurationRepository.nodeToConfiguration.get(node);
    const application = ApplicationRepository.nodeToApplication.get(node) ?? null;

    if (!configuration) {
      const transformed = processImplicitComponents(node, shouldAddInternalImport);

      return Context.ts.visitEachChild(transformed, visitor, tsContext);
    }

    shouldAddInternalImport.value = true;

    const transformConfigurationOrApplicationLabel = `Transforming configuration or application class, file: ${node.getSourceFile().fileName}, class: ${node.name?.text}`;
    Logger.verboseDuration(transformConfigurationOrApplicationLabel);
    const transformed = transformConfigurationOrApplicationClass(node, configuration, application);
    Logger.verboseDuration(transformConfigurationOrApplicationLabel);

    return Context.ts.visitEachChild(transformed, visitor, tsContext);
  };

  const transformedFile = Context.ts.visitNode(sourceFile, visitor) as ts.SourceFile;

  if (Context.languageServiceMode) {
    return sourceFile;
  }

  const updatedStatements = Array.from(transformedFile.statements);

  if (ConfigLoader.get().mode === 'development') {
    ApplicationRepository.applicationIdToApplication.forEach((application) => {
      if (application.additionalFilesToAddDevelopmentMetadata.has(transformedFile.fileName)) {
        shouldAddInternalImport.value = true;
        const metadata = RuntimeMetadataBuilder.developmentApplicationMetadata(application.rootConfiguration, application);

        updatedStatements.push(
          factory.createExpressionStatement(factory.createCallExpression(
            factory.createPropertyAccessExpression(
              InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ClawjectInternalRuntimeUtils),
              factory.createIdentifier('defineDevelopmentApplicationMetadata')
            ),
            undefined,
            [
              valueToASTExpression(application.id),
              valueToASTExpression(Compiler.projectVersion),
              valueToASTExpression(metadata)
            ],
          ))
        );
      }
    });
  }

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
