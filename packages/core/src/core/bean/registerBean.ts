import type ts from 'typescript';
import { BeanKind } from './BeanKind';
import { BeanDefinitionMetadata } from '../metadata/v2/bean/BeanDefinitionMetadata';
import { Bean } from './Bean';
import { Configuration } from '../configuration/Configuration';
import { Dependency } from '../dependency/Dependency';
import { CType } from '../type-system/CType';
import { Context } from '../../compilation-context/Context';

export const registerBean = (
  configuration: Configuration,
  definitionMetadata: BeanDefinitionMetadata,
  beanKind: BeanKind.V2_CLASS | BeanKind.V2_FACTORY | BeanKind.V2_VALUE | BeanKind.V2_LIFECYCLE,
  signature: ts.Signature | null,
  classPropertyDeclaration: ts.PropertyDeclaration | ts.GetAccessorDeclaration
) => {
  const bean = new Bean({
    classMemberName: classPropertyDeclaration.name.getText(),
    node: classPropertyDeclaration,
    kind: beanKind,
    definitionMetadata: definitionMetadata,
    cType: new CType(definitionMetadata.type),
  });

  configuration.beanRegister.register(bean);

  if (signature) {
    signature.getParameters().forEach(dependencySymbol => {
      const parameterDeclaration = dependencySymbol.getDeclarations()?.[0] as ts.ParameterDeclaration | ts.PropertyDeclaration;
      if (!parameterDeclaration) {
        //TODO report error
        return;

      }
      const dependency = new Dependency();
      dependency.parameterName = dependencySymbol.getName();
      dependency.cType = new CType(Context.typeChecker.getTypeOfSymbol(dependencySymbol));
      dependency.node = parameterDeclaration;
      dependency.parentBean = bean;

      bean.registerDependency(dependency);
    });


    //TODO add only in development mode?
    signature.getReturnType().getSymbol()?.getDeclarations()?.forEach(declaration => {
      bean.signatureRelatedFileNames.add(declaration.getSourceFile().fileName);
    });
  }

  if (definitionMetadata.embedded) {
    const beanTypeProperties = definitionMetadata.type.getProperties();

    beanTypeProperties.forEach(propertySymbol => {
      //TODO add pre-defined definitionMetadata
      const embeddedBean = new Bean({
        classMemberName: bean.classMemberName,
        parentConfiguration: configuration,
        node: bean.node,
        kind: bean.kind,
        nestedProperty: propertySymbol.name,
        embeddedParent: bean,
        cType: new CType(Context.typeChecker.getTypeOfSymbol(propertySymbol)),
      });
      configuration.beanRegister.register(embeddedBean);
    });
  }
};
