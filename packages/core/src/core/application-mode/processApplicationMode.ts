import type * as ts from 'typescript';
import { Context } from '../../compilation-context/Context';
import { InternalsAccessBuilder } from '../internals-access/InternalsAccessBuilder';
import { Logger } from '../../logger/Logger';
import { Value } from '../utils/Value';
import { CONSTANTS } from '../../constants/index';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { ApplicationRepository } from '../application/ApplicationRepository';
import { processImplicitComponents } from './processImplicitComponents';
import { transformConfigurationOrApplicationClass } from './transformers/transformConfigurationOrApplicationClass';

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
