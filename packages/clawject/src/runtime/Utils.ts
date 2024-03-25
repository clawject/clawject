import { ClassConstructor } from './api/ClassConstructor';
import { MaybeAsync } from './types/MaybeAsync';
import { InstantiationConstructorParameters } from './api/InstantiationConstructorParameters';
import { ObjectStorage } from './ObjectStorage';

export class Utils {

  static createVersionedStorageOrGetIfExisted = <T>(key: string, version: number, defaultValue: T): T => {
    const storages = ObjectStorage.getOrSetIfNotPresent(key, new Map<number, T>());

    let storage = storages.get(version);

    if (!storage) {
      storage = defaultValue;
      storages.set(version, storage);
    }

    return storage;
  };

  static getConstructorFromInstance = (element: any): ClassConstructor<any> | null => {
    if (!element) {
      return null;
    }

    const objectPrototype = Object.getPrototypeOf(element);

    if (!objectPrototype) {
      return null;
    }

    return objectPrototype.constructor;
  };

  static isObject = (value: any): value is object | Function => {
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
  };

  static isFunction = (value: any): value is Function => {
    const type = typeof value;
    return value !== null && (type === 'function');
  };

  static capitalizeFirstLetter = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

  static isPromise = <T>(value: MaybeAsync<T>): value is Promise<T> => {
    return value instanceof Promise;
  };

  static readonly EMPTY_VALUE = Symbol();
  static getValueSafe = <K, V>(map: ReadonlyMap<K, V>, key: K): V | typeof this.EMPTY_VALUE => {
    if (!map.has(key)) {
      return this.EMPTY_VALUE;
    }

    return map.get(key)!;
  };

  static async getResolvedConstructorParameters(constructorParameters: InstantiationConstructorParameters<any[]>): Promise<any[]> {
    if (!constructorParameters) {
      return [];
    }

    if (typeof constructorParameters === 'function') {
      return constructorParameters();
    }

    return constructorParameters;
  }
}
