import type ts from 'typescript';
import { WeakNodeHolder } from './WeakNodeHolder';

export class Entity<N extends ts.Node = ts.Node> extends WeakNodeHolder<N> {}
