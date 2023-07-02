import ts from 'typescript';
import { getNodeDetails, NodeDetails } from './ts/utils/getNodeDetails';

export class WeakNodeHolder<N extends ts.Node = ts.Node> {
    private _nodeRef: WeakRef<N> | null = null;
    private _nodeDetails: NodeDetails | null = null;
    private _hasBeenSet = false;

    public get node(): N {
        if (this._nodeRef === null) {
            throw new Error('Trying to access node before its initialization');
        }

        const node = this._nodeRef.deref();

        if (!node) {
            throw new Error('Trying to access disposed node');
        }

        return node;
    }

    public set node(node: N) {
        this._nodeRef = new WeakRef(node);
        this._nodeDetails = getNodeDetails(node);
        this._hasBeenSet = true;
    }

    public hasBeenSet(): boolean {
        return this._hasBeenSet;
    }

    public get nodeDetails(): NodeDetails {
        if (this._nodeDetails === null) {
            throw new Error('Trying to access node details before its initialization');
        }

        return this._nodeDetails;
    }
}
