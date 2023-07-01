import ts from 'typescript';

export const getDecoratorsOnly = (node: ts.Node): ts.Decorator[] =>
    ts.canHaveDecorators(node) ? [...(ts.getDecorators(node) ?? [])] : [];
