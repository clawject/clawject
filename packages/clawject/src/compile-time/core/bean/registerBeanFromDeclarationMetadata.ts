import ts from 'typescript';
import { Configuration } from '../configuration/Configuration';
import { BeanDeclarationMetadata } from '../declaration-metadata/ConfigurationDeclarationMetadata';
import { Bean, BeanNode } from './Bean';

export const registerBeanFromDeclarationMetadata = (
  configuration: Configuration,
  classElement: ts.ClassElement,
  classElementName: string,
  beanDeclarationMetadata: BeanDeclarationMetadata,
): void => {
  const bean = new Bean({
    classMemberName: classElementName,
    node: classElement as BeanNode,
    kind: beanDeclarationMetadata.kind,
    primary: beanDeclarationMetadata.primary,
    nestedProperty: beanDeclarationMetadata.nestedProperty,
    qualifier: beanDeclarationMetadata.qualifier,
  });

  configuration.beanRegister.register(bean);
};
