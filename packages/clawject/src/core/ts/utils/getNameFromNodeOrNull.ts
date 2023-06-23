import ts from 'typescript';
import { isNamedDeclaration } from '../predicates/isNamedDeclaration';

export const getNameFromNodeOrNull = (declaration: ts.Node): string | null => {
    if (isNamedDeclaration(declaration)) {
        return declaration.name?.getText() ?? null;
    }

    return null;
};
