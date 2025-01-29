import type ts from 'typescript';
import { ConfigurationRepository } from '../../core/configuration/ConfigurationRepository';
import { ApplicationRepository } from '../../core/application/ApplicationRepository';
import { Context } from '../../compilation-context/Context';
import { DeclarationMetadataBuilder } from '../../core/metadata/DeclarationMetadataBuilder';
import { CompileTimeElement } from '../../core/metadata/CompileTimeElement';

/** @public */
const transformer = (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  return context => (sourceFile): ts.SourceFile => {
    Context.assignProgram(program);

    if (!ConfigurationRepository.fileNameToConfigurations.has(sourceFile.fileName) && !ApplicationRepository.fileNameToApplications.has(sourceFile.fileName)) {
      return sourceFile;
    }

    const metadataStorageIdentifier = Context.factory.createUniqueName('ClawjectMetadata');
    const metadataNodes = new Map<ts.Identifier, ts.TypeNode>();

    const visitor = (node: ts.Node): ts.Node => {
      if (!node.original) {
        return Context.ts.visitEachChild(node, visitor, context);
      }

      let transformedNode = node;

      if (Context.ts.isClassDeclaration(node)) {

        const configuration = ConfigurationRepository.nodeToConfiguration
          .get(node.original as ts.ClassDeclaration);
        const application = ApplicationRepository.nodeToApplication.get(node.original as ts.ClassDeclaration);

        let metadataNode: ts.TypeNode | null = null;

        //Order is important because application is also a configuration
        if (application) {
          metadataNode = DeclarationMetadataBuilder.buildForApplication(application);
        } else if (configuration) {
          metadataNode = DeclarationMetadataBuilder.buildForConfiguration(configuration);
        }

        if (metadataNode) {
          const key = node.name ? node.name.getText() : '_unnamed';
          const identifier = Context.factory.createUniqueName(key);
          metadataNodes.set(identifier, metadataNode);

          const propertyAssignment = Context.factory.createPropertyDeclaration(
            undefined,
            Context.factory.createPrivateIdentifier(CompileTimeElement.COMPILE_TIME_METADATA),
            undefined,
            Context.factory.createTypeReferenceNode(
              Context.factory.createQualifiedName(
                metadataStorageIdentifier,
                identifier
              ),
              undefined
            ),
            undefined
          );

          transformedNode = Context.factory.updateClassDeclaration(
            node,
            node.modifiers,
            node.name,
            node.typeParameters,
            node.heritageClauses,
            [
              ...node.members,
              propertyAssignment,
            ]
          );
        }
      }

      return Context.ts.visitEachChild(transformedNode, visitor, context);
    };

    const updatedSourceFile = Context.ts.visitNode(sourceFile, visitor) as ts.SourceFile;

    if (metadataNodes.size === 0) {
      return updatedSourceFile;
    }

    const metadataStorageMembers = Array.from(metadataNodes.entries()).map(([identifier, typeNode]) => {
      return Context.factory.createTypeAliasDeclaration(
        [Context.factory.createToken(Context.ts.SyntaxKind.ExportKeyword)],
        identifier,
        undefined,
        typeNode
      );
    });

    const metadataStorageDeclaration = Context.factory.createModuleDeclaration(
      [
        Context.factory.createToken(Context.ts.SyntaxKind.DeclareKeyword)
      ],
      metadataStorageIdentifier,
      Context.factory.createModuleBlock(metadataStorageMembers),
      Context.ts.NodeFlags.Namespace | Context.ts.NodeFlags.ExportContext | Context.ts.NodeFlags.Ambient | Context.ts.NodeFlags.ContextFlags
    );


    return Context.factory.updateSourceFile(
      sourceFile,
      [
        ...updatedSourceFile.statements,
        metadataStorageDeclaration
      ],
      sourceFile.isDeclarationFile,
      sourceFile.referencedFiles,
      sourceFile.typeReferenceDirectives,
      sourceFile.hasNoDefaultLib,
      sourceFile.libReferenceDirectives,
    );
  };
};

/** @public */
export const ClawjectMetadataTransformer = (programGetter: () => ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  const target = {} as ts.Program;

  const programProxy = new Proxy(target, {
    get(target: ts.Program, p: string | symbol, receiver: any): any {
      return (programGetter() as any)[p];
    },
    set(target: ts.Program, p: string | symbol, newValue: any, receiver: any): boolean {
      throw Error('ts.Program\'s methods are readonly');
    }
  });

  return transformer(programProxy);
};

export default transformer;
