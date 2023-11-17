export class ClawjectObjectStorage {
  private static store = new Map<string, object>();

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
