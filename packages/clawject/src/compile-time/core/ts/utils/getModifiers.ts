import ts from 'typescript';

export const getModifiers = (node: ts.Node): ts.Modifier[] => {
  const modifiers = ts.canHaveModifiers(node) ? [...(ts.getModifiers(node) ?? [])] : [];

  return modifiers;
};
