export class ClawjectObjectStorage {
  private static StorageSymbol = Symbol.for('____ClawjectObjectStorage_76d37f0680b145159b563058a6cc0101____');

  private static store: Map<string, object> = (() => {
    const store = globalThis[this.StorageSymbol];

    if (store) {
      return store;
    }

    const newStore = new Map<string, object>();

    Object.defineProperty(globalThis, this.StorageSymbol, {
      enumerable: false,
      value: newStore,
      configurable: false,
      writable: false,
    });

    return newStore;
  })();

  static has(key: string): boolean {
    return this.store.has(key);
  }

  static get<T extends object>(key: string): T | null {
    return this.store.get(key) as T ?? null;
  }

  static getOrSetIfNotPresent<T extends object>(key: string, defaultValue: T): T {
    if (!this.store.has(key)) {
      this.store.set(key, defaultValue);
    }

    return this.store.get(key) as T;
  }

  static set<T extends object>(key: string, value: T): void {
    this.store.set(key, value);
  }

  static clear(): void {
    this.store.clear();
  }
}
