import ts from 'typescript';
import { Configuration } from '../configuration/Configuration';
import { BeanDeclarationMetadata } from '../declaration-metadata/ConfigurationDeclarationMetadata';
import { Bean, BeanNode } from './Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { BeanKind } from './BeanKind';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';

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

  let type: ts.Type | null = getCompilationContext().typeChecker.getTypeAtLocation(classElement);

  if (bean.kind === BeanKind.CLASS_CONSTRUCTOR) {
    type = DITypeBuilder.getAwaitedType(type);
  }

  if (!type) {
    getCompilationContext().report(new TypeQualifyError(
      null,
      classElement,
      configuration,
    ));
    return;
  }

  bean.registerType(DITypeBuilder.build(type));

  configuration.beanRegister.register(bean);
};
