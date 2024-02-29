import { AsyncLocalStorage } from 'node:async_hooks';

export class HttpExecutionContext {
  private static idSeq = 0;
  private static asyncLocalStorage = new AsyncLocalStorage<number>();

  static run<T>(callback: () => T): T {
    return this.asyncLocalStorage.run(this.idSeq++, callback);
  }

  static getCurrentRequestId(): number {
    //For simplicity - let's assume that AsyncLocalStorage always returns a value
    return this.asyncLocalStorage.getStore()!;
  }
}
