import ts from 'typescript';

export const getModifiersOnly = (node: ts.Node): ts.Modifier[] => {
    if (ts.canHaveModifiers(node)) {
        return [...ts.getModifiers(node) ?? []].filter(it => ts.isModifier(it));
    }

    return [];
};
