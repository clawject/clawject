import type ts from 'typescript';
import { Context } from '../../../compilation-context/Context';

export const getDecorators = (node: ts.Node): ts.Decorator[] => {
  return Context.ts.canHaveDecorators(node) ? [...(Context.ts.getDecorators(node) ?? [])] : [];
};
