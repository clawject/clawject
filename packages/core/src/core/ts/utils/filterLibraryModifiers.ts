import type ts from 'typescript';
import { DecoratorProcessor } from '../../decorators/DecoratorProcessor';

export const filterLibraryModifiers = (modifiers: ts.ModifierLike[] | ts.NodeArray<ts.ModifierLike> | undefined): ts.ModifierLike[] | undefined => {
  const filtered = modifiers?.filter(it => !DecoratorProcessor.isRegisteredDecorator(it));

  return filtered;
};
