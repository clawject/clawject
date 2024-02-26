import { ApplicationBean } from './ApplicationBean';
import { Utils } from '../Utils';
import { RuntimeErrors } from '../api/RuntimeErrors';

export class ProxyBuilder {
  private static assertValidProxyValueAndGet = (parentBean: ApplicationBean, targetAccessor: () => any): any => {
    const value = targetAccessor();

    const isFunction = Utils.isFunction(value);

    if (isFunction) {
      const msg =
        `Bean named "${parentBean.name}", with scope: "${parentBean.scopeName}" - ` +
        'contains function value which is not allowed to be proxied, ' +
        'To solve this issue - you can wrap function in object that contains function as a property.';

      throw new RuntimeErrors.CouldNotBeProxiedError(msg);
    }

    if (Utils.isObject(value)) {
      return value;
    }

    const msg =
      `Bean named "${parentBean.name}", with scope: "${parentBean.scopeName}" - ` +
      'contains primitive value which could not be proxied, ' +
      'ES standard allows only object-like proxies.' +
      'To solve this issue - you can wrap your primitive value in object that contains value as a property.';

    throw new RuntimeErrors.CouldNotBeProxiedError(msg);
  };

  static build(parentBean: ApplicationBean, targetAccessor: () => any): any {
    return new Proxy({}, {
      apply: (_: any, thisArg: any, argArray: any[]) => {
        return Reflect.apply(this.assertValidProxyValueAndGet(parentBean, targetAccessor), thisArg, argArray);
      },
      construct: (_: any, argArray: any[], newTarget: Function): object => {
        return Reflect.construct(this.assertValidProxyValueAndGet(parentBean, targetAccessor), argArray, newTarget);
      },
      defineProperty: (_: any, property: string | symbol, attributes: PropertyDescriptor): boolean => {
        return Reflect.defineProperty(this.assertValidProxyValueAndGet(parentBean, targetAccessor), property, attributes);
      },
      deleteProperty: (_: any, property: string | symbol): boolean => {
        return Reflect.deleteProperty(this.assertValidProxyValueAndGet(parentBean, targetAccessor), property);
      },
      get: (_: any, property: string | symbol, receiver: any) => {
        const obj = this.assertValidProxyValueAndGet(parentBean, targetAccessor);
        const propertyValue = Reflect.get(obj, property, receiver);

        if (typeof propertyValue === 'function') {
          return propertyValue.bind(obj);
        }

        return propertyValue;
      },
      getOwnPropertyDescriptor: (_: any, property: string | symbol): PropertyDescriptor | undefined => {
        return Reflect.getOwnPropertyDescriptor(this.assertValidProxyValueAndGet(parentBean, targetAccessor), property);
      },
      getPrototypeOf: (_: any): object | null => {
        return Reflect.getPrototypeOf(this.assertValidProxyValueAndGet(parentBean, targetAccessor));
      },
      has: (_: any, property: string | symbol): boolean => {
        return Reflect.has(this.assertValidProxyValueAndGet(parentBean, targetAccessor), property);
      },
      isExtensible: (_: any): boolean => {
        return Reflect.isExtensible(this.assertValidProxyValueAndGet(parentBean, targetAccessor));
      },
      ownKeys: (_: any): ArrayLike<string | symbol> => {
        return Reflect.ownKeys(this.assertValidProxyValueAndGet(parentBean, targetAccessor));
      },
      preventExtensions: (_: any): boolean => {
        return Reflect.preventExtensions(this.assertValidProxyValueAndGet(parentBean, targetAccessor));
      },
      set: (_: any, property: string | symbol, newValue: any, receiver: any): boolean => {
        return Reflect.set(this.assertValidProxyValueAndGet(parentBean, targetAccessor), property, newValue, receiver);
      },
      setPrototypeOf: (_: any, value: object | null): boolean => {
        return Reflect.setPrototypeOf(this.assertValidProxyValueAndGet(parentBean, targetAccessor), value);
      }
    });
  }
}
