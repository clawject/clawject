import ts from 'typescript';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';
import { BaseTypesRepository } from '../../type-system/BaseTypesRepository';
import { DITypeBuilder } from '../../type-system/DITypeBuilder';

export const isExtendsCatContext = (node: ts.Node): node is ts.ClassDeclaration => {
  if (!ts.isClassDeclaration(node)) {
    return false;
  }

  const extendsHeritageClause = node.heritageClauses?.find(clause => clause.token === ts.SyntaxKind.ExtendsKeyword);

  if (!extendsHeritageClause) {
    return false;
  }

  const tsType = getCompilationContext().typeChecker.getTypeAtLocation(extendsHeritageClause.types[0]);
  const diType = DITypeBuilder.build(tsType);

  return BaseTypesRepository.getBaseTypes().CatContext.isCompatible(diType);
};
