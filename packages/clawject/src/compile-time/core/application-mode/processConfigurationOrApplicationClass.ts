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

export const processConfigurationOrApplicationClass = (node: ts.ClassDeclaration): Configuration => {
  const configurationDecoratorMetadata =
    extractDecoratorMetadata(node, DecoratorKind.Configuration);
  const clawjectApplicationDecoratorMetadata = extractDecoratorMetadata(node, DecoratorKind.ClawjectApplication);

  if (configurationDecoratorMetadata !== null || clawjectApplicationDecoratorMetadata !== null) {
    const configuration = ConfigurationRepository.register(node);

    registerImports(configuration);
    registerBeans(configuration);

    return configuration;
  }

  const compilationMetadata = DeclarationMetadataParser.parse(node);

  if (compilationMetadata === null) {
    //TODO report compilation error
    throw new Error('Configuration class must have a metadata');
  }

  if (compilationMetadata.kind !== DeclarationMetadataKind.CONFIGURATION) {
    //TODO report compilation error
    throw new Error('Configuration class must have a configuration metadata');
  }

  const typedMetadata = compilationMetadata as ConfigurationDeclarationMetadata;
  const configuration = ConfigurationRepository.register(node);

  const classMemberNamesToNode = node.members.reduce((acc, member) => {
    if (member.name !== undefined) {
      acc[member.name.getText()] = member;
    }

    return acc;
  }, {} as Record<string, ts.ClassElement>);

  //Registering imports
  Object.keys(typedMetadata.imports).forEach((importElementName) => {
    const node = classMemberNamesToNode[importElementName];

    if (node === undefined) {
      //TODO report compilation error
      throw new Error('Import element must have a node');
    }

    if (!ts.isPropertyDeclaration(node)) {
      //TODO report compilation error
      throw new Error('Import element must be a property declaration');
    }

    registerImportForClassElementNode(configuration, node);
  });

  //Registering beans
  Object.entries(typedMetadata.beans).forEach(([beanElementName, beanDeclarationMetadata]) => {
    const node = classMemberNamesToNode[beanElementName];

    if (node === undefined) {
      //TODO report compilation error
      throw new Error('Bean element must have a node');
    }

    if (!ts.isPropertyDeclaration(node)) {
      //TODO report compilation error
      throw new Error('Bean element must be a property declaration');
    }

    registerBeanFromDeclarationMetadata(configuration, node, beanElementName, beanDeclarationMetadata);
  });


  return configuration;
};
