import ts from 'typescript';
import { hasIn } from 'lodash';

export const isNamedDeclaration = (declaration: ts.Declaration): declaration is ts.NamedDeclaration => {
    return hasIn(declaration, 'name');
};
