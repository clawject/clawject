import ts from 'typescript';
import { IDProvider } from './utils/IDProvider';
import { WeakNodeHolder } from './WeakNodeHolder';

export class BaseElement<N extends ts.Node = ts.Node> extends WeakNodeHolder<N> {
    public readonly runtimeId = IDProvider.next();
}
