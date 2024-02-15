import ts from 'typescript';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { registerImportForClassElementNode, registerImports } from '../import/registerImports';
import { registerBeans } from '../bean/registerBeans';
import { Configuration } from '../configuration/Configuration';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { DeclarationMetadataParser } from '../declaration-metadata/DeclarationMetadataParser';
import { DeclarationMetadataKind } from '../declaration-metadata/DeclarationMetadata';
import { ConfigurationDeclarationMetadata } from '../declaration-metadata/ConfigurationDeclarationMetadata';
import { registerBeanFromDeclarationMetadata } from '../bean/registerBeanFromDeclarationMetadata';
import { AbstractCompilationMessage } from '../../compilation-context/messages/AbstractCompilationMessage';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { ApplicationDeclarationMetadata } from '../declaration-metadata/ApplicationDeclarationMetadata';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { CorruptedMetadataError } from '../../compilation-context/messages/errors/CorruptedMetadataError';
import { registerBeanDependencies } from '../dependency/registerBeanDependencies';

export const processConfigurationOrApplicationClass = (node: ts.ClassDeclaration, parentImportNode: ts.Node | null, parentConfiguration: Configuration | null): Configuration | null => {
  const registeredConfiguration = ConfigurationRepository.nodeToConfiguration.get(node);

  if (registeredConfiguration) {
    return registeredConfiguration;
  }

  const configurationDecoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.Configuration);
  const clawjectApplicationDecoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.ClawjectApplication);

  const configuration = ConfigurationRepository.register(node);

  if (configurationDecoratorMetadata !== null || clawjectApplicationDecoratorMetadata !== null) {
    registerImports(configuration);
    registerBeans(configuration);
  } else {
    //This branch is for imported configurations
    const compilationMetadata = DeclarationMetadataParser.parse(node);

    if (parentImportNode === null && compilationMetadata === null) {
      return null;
    }

    if (parentImportNode !== null && compilationMetadata === null) {
      getCompilationContext().report(new NotSupportedError(
        'Only configuration and application classes can be imported in this context.',
        parentImportNode,
        parentConfiguration,
        null,
      ));
      return null;
    }

    if (compilationMetadata === null) {
      return null;
    }

    if (compilationMetadata instanceof AbstractCompilationMessage) {
      getCompilationContext().report(compilationMetadata);
      return null;
    }

    if (compilationMetadata.kind !== DeclarationMetadataKind.CONFIGURATION && compilationMetadata.kind !== DeclarationMetadataKind.APPLICATION) {
      getCompilationContext().report(new NotSupportedError(
        'Only configuration and application classes are supported here.',
        parentImportNode ?? node,
        parentConfiguration,
        null,
      ));
      return null;
    }

    const typedMetadata = compilationMetadata as ConfigurationDeclarationMetadata | ApplicationDeclarationMetadata;
    const classMemberNamesToNode = node.members.reduce((acc, member) => {
      if (member.name !== undefined) {
        acc[member.name.getText()] = member;
      }

      return acc;
    }, {} as Record<string, ts.ClassElement>);

    //Registering imports
    typedMetadata.imports.forEach(it => {
      const classElementNode = classMemberNamesToNode[it.classPropertyName] as ts.ClassElement | undefined;

      if (classElementNode === undefined) {
        getCompilationContext().report(new CorruptedMetadataError(
          `No class member declared in metadata found ${it.classPropertyName}.`,
          node,
          parentConfiguration,
          null,
        ));
        return;
      }

      if (!ts.isPropertyDeclaration(classElementNode)) {
        getCompilationContext().report(new CorruptedMetadataError(
          'Import element declared in metadata must be a property declaration.',
          classElementNode,
          parentConfiguration,
          null,
        ));
        return;
      }

      registerImportForClassElementNode(configuration, classElementNode, it.external);
    });

    //Registering beans
    typedMetadata.beans.forEach(beanDeclarationMetadata => {
      const classElementNode = classMemberNamesToNode[beanDeclarationMetadata.classPropertyName] as ts.ClassElement | undefined;

      if (classElementNode === undefined) {
        getCompilationContext().report(new CorruptedMetadataError(
          `No class member declared in metadata found ${beanDeclarationMetadata.classPropertyName}.`,
          node,
          parentConfiguration,
          null,
        ));
        return;
      }

      registerBeanFromDeclarationMetadata(configuration, classElementNode, beanDeclarationMetadata);
    });
  }

  registerBeanDependencies(configuration);

  return configuration;
};
