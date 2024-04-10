import type * as ts from 'typescript';
import { Context } from '../../../compilation-context/Context';

export const isStaticallyKnownPropertyName = (node: ts.PropertyName): boolean => {
  //Not supporting private identifiers because decorators can't be applied to them.
  return Context.ts.isIdentifier(node);
};
