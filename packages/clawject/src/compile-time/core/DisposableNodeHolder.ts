import ts from 'typescript';

export class DisposableNodeHolder<N extends ts.Node = ts.Node> {
  constructor(node?: N) {
    node && (this.node = node);
  }

  private _hasBeenInitialized = false;

  private _node: N | null = null;

  public get node(): N {
    if (this._node === null) {
      throw new Error('Trying to access node before its initialization');
    }

    return this._node;
  }

  public set node(node: N | null) {
    if (node === null) {
      return;
    }

    this._node = node;
    this._hasBeenInitialized = true;
  }

  public getAndDispose(): N {
    const node = this.node;

    this.clear();

    return node;
  }

  public isEmpty(): boolean {
    return !this._hasBeenInitialized;
  }

  public clear(): void {
    this._node = null;
    this._hasBeenInitialized = false;
  }
}
