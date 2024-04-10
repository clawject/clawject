export class DisposableNodeHolder<N extends object> {
  constructor(node?: N) {
    node && (this.value = node);
  }

  private _hasBeenInitialized = false;

  private _value: N | null = null;

  public get value(): N {
    if (this._value === null) {
      throw new Error('Trying to access node before its initialization');
    }

    return this._value;
  }

  public set value(node: N | null) {
    if (node === null) {
      return;
    }

    this._value = node;
    this._hasBeenInitialized = true;
  }

  public getAndDispose(): N {
    const node = this.value;

    this.clear();

    return node;
  }

  public getAndDisposeSafe(): N | null {
    if (!this._hasBeenInitialized) {
      return null;
    }

    return this.getAndDispose();
  }

  public isEmpty(): boolean {
    return !this._hasBeenInitialized;
  }

  public clear(): void {
    this._value = null;
    this._hasBeenInitialized = false;
  }
}
