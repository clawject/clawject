import ts from 'typescript';
import { isNamedDeclaration } from '../predicates/isNamedDeclaration';

export const getNameFromDeclarationOrNull = (declaration: ts.Declaration): string | null => {
    if (isNamedDeclaration(declaration)) {
        return declaration.name?.getText() ?? null;
    }

    return null;
};
