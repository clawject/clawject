import { RuntimeBeanMetadata } from '../metadata/MetadataTypes';
import { ApplicationBeanDependencyMetadata } from '../metadata/RuntimeApplicationMetadata';
import { RuntimeConfigurationMetadata } from '../metadata/RuntimeConfigurationMetadata';
import { InternalScopeRegister } from '../scope/InternalScopeRegister';
import { ObjectFactoryImpl } from '../object-factory/ObjectFactoryImpl';
import { ObjectFactoryResult } from '../object-factory/ObjectFactory';
import { CustomScope } from '../scope/CustomScope';
import { InternalUtils } from '../InternalUtils';
import { RuntimeErrors } from '../errors';
import { BeanKind } from '../../compile-time/core/bean/BeanKind';
import { ClassConstructor } from '../ClassConstructor';
import { ApplicationBeanDependency } from './ApplicationBeanDependency';

export class ApplicationBean {
  private proxy: any | null = null;
  public readonly name: string;
  private _objectFactory: ObjectFactoryImpl | null = null;

  get objectFactory(): ObjectFactoryImpl {
    if (this._objectFactory === null) {
      //TODO runtime error
      throw new Error('Object factory not initialized');
    }

    return this._objectFactory;
  }

  constructor(
    public readonly id: number,
    public readonly parentConfigurationIndex: number,
    public readonly beanClassProperty: string,
    public readonly beanMetadata: RuntimeBeanMetadata,
    public readonly parentConfigurationMetadata: RuntimeConfigurationMetadata,
    public readonly dependencies: ApplicationBeanDependency[] | null,
    public readonly classConstructor: ClassConstructor<any> | null
  ) {
    this.name = `${parentConfigurationIndex}_${id}`;
  }

  init(objectFactory: ObjectFactoryImpl): void {
    this._objectFactory = objectFactory;
  }

  getValue(): ObjectFactoryResult {
    if (this._objectFactory === null) {
      //TODO runtime error
      throw new Error('Object factory not initialized');
    }

    const scope = this.getScope();
    const useProxy = scope.useProxy?.() ?? true;

    if (useProxy) {
      return this.getProxyBean();
    }

    return this.getBeanFromScope();
  }

  get lazy(): boolean {
    return this.beanMetadata.lazy ?? this.parentConfigurationMetadata.lazy;
  }

  get scopeName(): string {
    return this.beanMetadata.scope ?? this.parentConfigurationMetadata.scope;
  }

  get isLifecycleFunction(): boolean {
    return this.beanMetadata.kind === BeanKind.LIFECYCLE_METHOD || this.beanMetadata.kind === BeanKind.LIFECYCLE_ARROW_FUNCTION;
  }

  getScope(): CustomScope {
    return InternalScopeRegister.getScope(this.scopeName);
  }

  private getBeanFromScope(): ObjectFactoryResult {
    return this.getScope().get(this.name, this.objectFactory);
  }

  private getProxyBean(): any {
    if (this.proxy) {
      return this.proxy;
    }

    const assertNotPrimitiveAndConstruct = (): any => {
      const bean = this.getBeanFromScope();

      if (InternalUtils.isObject(bean)) {
        return bean;
      }

      const msg =
        `Bean named "${this.name}", with scope: "${this.scopeName}" - ` +
        'contains primitive value which could not be wrapped in Proxy, ' +
        'ES standard allows only object proxies.' +
        'To solve this issue - you can wrap your primitive value in object.';

      throw new RuntimeErrors.PrimitiveCouldNotBeWrappedInProxyError(msg);
    };

    this.proxy = new Proxy({}, {
      apply: (_: any, thisArg: any, argArray: any[]) => {
        return Reflect.apply(assertNotPrimitiveAndConstruct(), thisArg, argArray);
      },
      construct: (_: any, argArray: any[], newTarget: Function): object => {
        return Reflect.construct(assertNotPrimitiveAndConstruct(), argArray, newTarget);
      },
      defineProperty: (_: any, property: string | symbol, attributes: PropertyDescriptor): boolean => {
        return Reflect.defineProperty(assertNotPrimitiveAndConstruct(), property, attributes);
      },
      deleteProperty: (_: any, property: string | symbol): boolean => {
        return Reflect.deleteProperty(assertNotPrimitiveAndConstruct(), property);
      },
      get: (_: any, property: string | symbol, receiver: any) => {
        return Reflect.get(assertNotPrimitiveAndConstruct(), property, receiver);
      },
      getOwnPropertyDescriptor: (_: any, property: string | symbol): PropertyDescriptor | undefined => {
        return Reflect.getOwnPropertyDescriptor(assertNotPrimitiveAndConstruct(), property);
      },
      getPrototypeOf: (_: any): object | null => {
        return Reflect.getPrototypeOf(assertNotPrimitiveAndConstruct());
      },
      has: (_: any, property: string | symbol): boolean => {
        return Reflect.has(assertNotPrimitiveAndConstruct(), property);
      },
      isExtensible: (_: any): boolean => {
        return Reflect.isExtensible(assertNotPrimitiveAndConstruct());
      },
      ownKeys: (_: any): ArrayLike<string | symbol> => {
        return Reflect.ownKeys(assertNotPrimitiveAndConstruct());
      },
      preventExtensions: (_: any): boolean => {
        return Reflect.preventExtensions(assertNotPrimitiveAndConstruct());
      },
      set: (_: any, property: string | symbol, newValue: any, receiver: any): boolean => {
        return Reflect.set(assertNotPrimitiveAndConstruct(), property, newValue, receiver);
      },
      setPrototypeOf: (_: any, value: object | null): boolean => {
        return Reflect.setPrototypeOf(assertNotPrimitiveAndConstruct(), value);
      }
    });

    return this.proxy;
  }
}
