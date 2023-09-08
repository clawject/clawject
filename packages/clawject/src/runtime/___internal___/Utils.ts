export class Utils {
  public static createSet<T>(values: T[]): Set<T> {
    return new Set(values);
  }

  public static createMap<K, V>(values: [K, V][]): Map<K, V> {
    return new Map(values);
  }

  public static defineProperty(target: any, propertyKey: string, value: any) {
    Object.defineProperty(target, propertyKey, {
      value: value,
    });
  }

  public static isObject(value: any): boolean {
    const type = typeof value;
    return value !== null && (typeof type === 'object' || typeof type === 'function');
  }
}
