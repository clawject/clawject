import ts from 'typescript';
import { Configuration } from '../configuration/Configuration';
import { Bean } from './Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { MissingBeansDeclarationError } from '../../compilation-context/messages/errors/MissingBeansDeclarationError';
import { TypeMismatchError } from '../../compilation-context/messages/errors/TypeMismatchError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';

export const checkIsAllBeansRegisteredInContextAndFillBeanRequierness = (context: Configuration): void => {
  const compilationContext = getCompilationContext();
  const extendsHeritageClause = context.node.heritageClauses
    ?.find(clause => clause.token === ts.SyntaxKind.ExtendsKeyword);

  if (!extendsHeritageClause) {
    return;
  }

  const typeArgs = extendsHeritageClause.types[0].typeArguments ?? null;

  if (typeArgs === null || !typeArgs[0]) {
    //If no type args - assuming that all beans are "private"
    return;
  }

  const typeArgNode = typeArgs[0];

  const typeChecker = compilationContext.typeChecker;
  const type = typeChecker.getTypeAtLocation(typeArgNode);
  const diType = DITypeBuilder.build(type);

  context.registerDIType(diType);
  const typeProperties = type.getProperties();
  const contextBeans = Array.from(context.beanRegister.elements);
  const beans = contextBeans
    .reduce((acc, curr) => {
      acc.set(curr.classMemberName, curr);
      return acc;
    }, new Map<string, Bean>());

  const missingElements: ts.Symbol[] = [];
  const typeMismatchElements: Bean[] = [];

  typeProperties.forEach((property) => {
    const propertyName = property.getName();
    const propertyType = typeChecker.getTypeOfSymbolAtLocation(property, typeArgNode);
    const propertyDIType = DITypeBuilder.build(propertyType);
    const bean = beans.get(propertyName);

    if (!bean) {
      missingElements.push(property);
      return;
    }

    if (!propertyDIType.isCompatible(bean.diType)) {
      typeMismatchElements.push(bean);
      return;
    }

    bean.external = true;
  });

  if (missingElements.length > 0) {
    compilationContext.report(new MissingBeansDeclarationError(
      'Following beans are required, but not found in context.',
      typeArgNode,
      context,
      missingElements,
    ));
  }

  if (typeMismatchElements.length > 0) {
    compilationContext.report(new TypeMismatchError(
      'Following Beans are not compatible with type declared in base Context type.',
      typeArgNode,
      context,
      typeMismatchElements,
    ));
  }
};
