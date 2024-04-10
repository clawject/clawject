export class IDProvider {
  private static counter = -1;

  static next(): number {
    this.counter += 1;

    return this.counter;
  }
}
