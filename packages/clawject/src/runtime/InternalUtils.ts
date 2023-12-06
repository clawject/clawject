import { ClawjectObjectStorage } from '@clawject/object-storage';
import { ClassConstructor } from './ClassConstructor';

export class InternalUtils {

  static createVersionedStorageOrGetIfExisted<T>(key: string, version: number, defaultValue: T): T {
    const storages = ClawjectObjectStorage.getOrSetIfNotPresent(key, new Map<number, T>());

    let storage = storages.get(version);

    if (!storage) {
      storage = defaultValue;
      storages.set(version, storage);
    }

    return storage;
  }

  static getConstructorFromInstance(element: any): ClassConstructor<any> | null {
    if (!element) {
      return null;
    }

    const objectPrototype = Object.getPrototypeOf(element);

    if (!objectPrototype) {
      return null;
    }

    return objectPrototype.constructor;
  }

  static isObject(value: any): boolean {
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
  }
}
