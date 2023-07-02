import ts from 'typescript';

export class DisposableNodeHolder<N extends ts.Node = ts.Node> {
    private _node: N | null = null;
    private _hasBeenInitialized = false;

    public getAndDispose(): N {
        const node = this.node;

        this.clear();

        return node;
    }

    public get node(): N {
        if (this._node === null) {
            throw new Error('Trying to access node before its initialization');
        }

        return this._node;
    }

    public set node(node: N) {
        this._node = node;
        this._hasBeenInitialized = true;
    }

    public hasBeenInitialized(): boolean {
        return this._hasBeenInitialized;
    }

    public clear(): void {
        this._node = null;
        this._hasBeenInitialized = false;
    }
}
