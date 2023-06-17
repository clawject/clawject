import ts from 'typescript';

export const getDecoratorsOnly = (node: ts.Node): ts.Decorator[] => {
    if (ts.canHaveDecorators(node)) {
        return [...ts.getDecorators(node) ?? []];
    }

    return [];
};
