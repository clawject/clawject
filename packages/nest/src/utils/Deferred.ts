import { RuntimeErrors } from '@clawject/di';

export class Deferred<T> {
  public value: Promise<T>;
  private _resolve!: (value: T) => void;

  constructor() {
    this.value = new Promise<T>((resolve) => {
      this.resolve = resolve;
    });
  }

  private resolved = false;
  resolve(value: any): void {
    if (this.resolved) {
      throw new RuntimeErrors.IllegalStateError('Deferred has already been resolved.');
    }

    this.resolved = true;
    this._resolve(value);
  }
}
