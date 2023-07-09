import Big from 'big.js';

export class IDProvider {
  private static counter = new Big(-1);

  static next(): string {
    this.counter = this.counter.add(1);

    return this.counter.valueOf();
  }
}
