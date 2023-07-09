import ts from 'typescript';
import { hasIn } from 'lodash';

export const isNamedDeclaration = (declaration: ts.Node): declaration is ts.NamedDeclaration => {
  return hasIn(declaration, 'name');
};
