import type * as ts from 'typescript';
import { getNodeDetails, NodeDetails } from './ts/utils/getNodeDetails';
import { Context } from '../compilation-context/Context';

export class WeakNodeHolder<N extends ts.Node = ts.Node> {
  constructor(node?: N) {
    node && (this.node = node);
  }

  private _nodeRef: WeakRef<N> | null = null;
  private _hasBeenSet = false;

  private _nodeDetails: NodeDetails | null = null;
  private _nameNodeDetails: NodeDetails | null = null;

  public get nodeDetails(): NodeDetails {
    if (this._nodeDetails === null) {
      throw new Error('Trying to access node details before its initialization');
    }

    return this._nodeDetails;
  }

  public get nameNodeDetails(): NodeDetails | null {
    return this._nameNodeDetails;
  }

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
    this._nameNodeDetails = Context.ts.isNamedDeclaration(node) ? getNodeDetails(node.name) : null;
    this._hasBeenSet = true;
  }

  public getNodeSafe(): N | null {
    return this._nodeRef?.deref() ?? null;
  }

  public hasBeenSet(): boolean {
    return this._hasBeenSet;
  }
}
