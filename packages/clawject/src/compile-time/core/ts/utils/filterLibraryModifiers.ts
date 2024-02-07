import ts from 'typescript';
import { isDecoratorFromLibrary } from '../../decorator-processor/isDecoratorFromLibrary';

export const filterLibraryModifiers = (modifiers: ts.ModifierLike[] | ts.NodeArray<ts.ModifierLike> | undefined): ts.ModifierLike[] | undefined => {
  return modifiers?.filter(it => !isDecoratorFromLibrary(it, undefined));
};
