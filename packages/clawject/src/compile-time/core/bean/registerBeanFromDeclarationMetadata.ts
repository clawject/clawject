import type * as ts from 'typescript';
import { Configuration } from '../configuration/Configuration';
import { BeanDeclarationMetadata } from '../declaration-metadata/ConfigurationDeclarationMetadata';
import { Bean, BeanNode } from './Bean';
import { fillBeanType } from './fillBeanTypes';

export const registerBeanFromDeclarationMetadata = (
  configuration: Configuration,
  classElement: ts.ClassElement,
  beanDeclarationMetadata: BeanDeclarationMetadata,
): void => {
  const bean = new Bean({
    classMemberName: beanDeclarationMetadata.classPropertyName,
    node: classElement as BeanNode,
    kind: beanDeclarationMetadata.kind,
    primary: beanDeclarationMetadata.primary,
    external: beanDeclarationMetadata.external,
    nestedProperty: beanDeclarationMetadata.nestedProperty,
    qualifier: beanDeclarationMetadata.qualifier,
  });

  configuration.beanRegister.register(bean);

  fillBeanType(configuration, bean);
};
