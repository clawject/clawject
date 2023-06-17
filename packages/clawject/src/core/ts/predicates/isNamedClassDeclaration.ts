import ts from 'typescript';
import { NamedClassDeclaration } from '../types';

export const isNamedClassDeclaration = (node: ts.Node | null): node is NamedClassDeclaration => {
    if (node === null) {
        return false;
    }

    return ts.isClassDeclaration(node) && node.name !== undefined;
};
