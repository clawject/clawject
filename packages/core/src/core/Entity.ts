import type * as ts from 'typescript';
import { IDProvider } from './utils/IDProvider';
import { WeakNodeHolder } from './WeakNodeHolder';

export class Entity<N extends ts.Node = ts.Node> extends WeakNodeHolder<N> {
  public readonly runtimeId = IDProvider.next();
}
