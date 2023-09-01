import ts from 'typescript';
import { IncorrectTypeDefinitionError } from '../../compilation-context/messages/errors/IncorrectTypeDefinitionError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Configuration } from '../configuration/Configuration';
import { Bean } from './Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { MissingBeansDeclaration } from '../../compilation-context/messages/errors/MissingBeansDeclaration';
import { TypeMismatchError } from '../../compilation-context/messages/errors/TypeMismatchError';

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

  if (!diType.isObject) {
    compilationContext.report(new IncorrectTypeDefinitionError(
      'Should be an object-like type.',
      typeArgNode,
      context,
    ));
    return;
  }

  context.registerDIType(diType);
  const typeProperties = type.getProperties();
  const contextBeans = Array.from(context.beanRegister.elements);
  const beans = contextBeans
    .reduce((acc, curr) => {
      acc.set(curr.classMemberName, curr);
      return acc;
    }, new Map<string, Bean>());

  const missingElements: ts.Symbol[] = [];
  const typeMismatchElements: ts.Symbol[] = [];

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
      typeMismatchElements.push(property);
      return;
    }

    bean.public = true;
  });

  if (missingElements.length > 0) {
    compilationContext.report(new MissingBeansDeclaration(
      'Following beans are required, but not found in context.',
      typeArgNode,
      context,
      missingElements,
    ));
  }

  if (typeMismatchElements.length > 0) {
    compilationContext.report(new TypeMismatchError(
      'Type of Bean is not compatible with type of property declared in a context type.',
      typeArgNode,
      context,
      typeMismatchElements,
    ));
  }
};