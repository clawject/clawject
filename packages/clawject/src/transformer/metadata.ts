import ts, { factory } from 'typescript';
import { getCompilationContext } from './getCompilationContext';
import { ConfigurationRepository } from '../compile-time/core/configuration/ConfigurationRepository';
import { CompilationMetadataBuilder } from '../compile-time/core/compilation-metadata/CompilationMetadataBuilder';
import { ComponentRepository } from '../compile-time/core/component/ComponentRepository';
import { Configuration } from '../compile-time/core/configuration/Configuration';
import { Component } from '../compile-time/core/component/Component';
import { CompileTimeElement } from '../compile-time/core/compilation-metadata/CompileTimeElement';

/** @public */
const transformer = (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  const compilationContext = getCompilationContext();

  return context => (sourceFile): ts.SourceFile => {


    compilationContext.assignProgram(program);

    const fileConfigurations = (ConfigurationRepository.fileNameToConfigurations.get(sourceFile.fileName) ?? [])
      .reduce((acc, configuration) => {
        acc.set(configuration.node, configuration);
        return acc;
      }, new Map<ts.Node, Configuration>());
    const fileComponents = (ComponentRepository.fileNameToComponents.get(sourceFile.fileName) ?? [])
      .reduce((acc, component) => {
        acc.set(component.node, component);
        return acc;
      }, new Map<ts.Node, Component>());

    if (fileConfigurations.size === 0 && fileComponents.size === 0) {
      return sourceFile;
    }

    const visitor = (node: ts.Node): ts.Node => {
      if (!ts.isClassDeclaration(node)) {
        return ts.visitEachChild(node, visitor, context);
      }

      if (!node.original) {
        return ts.visitEachChild(node, visitor, context);
      }

      const configuration = fileConfigurations.get(node.original);
      const component = fileComponents.get(node.original);

      if (!configuration && !component) {
        return ts.visitEachChild(node, visitor, context);
      }

      const classMembers = Array.from(node.members);

      let metadataProperty = ts.factory.createPropertyDeclaration(
        [
          ts.factory.createToken(ts.SyntaxKind.PrivateKeyword),
          ts.factory.createToken(ts.SyntaxKind.StaticKeyword)
        ],
        ts.factory.createIdentifier(CompileTimeElement.COMPILE_TIME_METADATA),
        undefined,
        undefined,
        undefined
      );

      if (configuration) {
        metadataProperty = ts.addSyntheticLeadingComment(
          metadataProperty,
          ts.SyntaxKind.MultiLineCommentTrivia,
          CompilationMetadataBuilder.buildForConfiguration(configuration),
          true,
        );
        classMembers.push(metadataProperty);
      }

      if (component) {
        metadataProperty = ts.addSyntheticLeadingComment(
          metadataProperty,
          ts.SyntaxKind.MultiLineCommentTrivia,
          CompilationMetadataBuilder.buildForComponent(component),
          true,
        );
        classMembers.push(metadataProperty);
      }

      const updatedClassDeclaration = ts.factory.updateClassDeclaration(
        node,
        node.modifiers,
        node.name,
        node.typeParameters,
        node.heritageClauses,
        classMembers,
      );

      return ts.visitEachChild(updatedClassDeclaration, visitor, context);
    };

    return ts.visitNode(sourceFile, visitor) as ts.SourceFile;
  };
};

/** @public */
export const ClawjectMetadataTransformer = (programGetter: () => ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  const target = {} as ts.Program;

  const programProxy = new Proxy(target, {
    get(target: ts.Program, p: string | symbol, receiver: any): any {
      return programGetter()[p];
    },
    set(target: ts.Program, p: string | symbol, newValue: any, receiver: any): boolean {
      throw Error('ts.Program\'s methods are readonly');
    }
  });

  return transformer(programProxy);
};

export default transformer;
