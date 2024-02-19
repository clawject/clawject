import { RuntimeBeanMetadata } from '../metadata/MetadataTypes';
import { InternalScopeRegister } from '../scope/InternalScopeRegister';
import { ObjectFactoryImpl } from '../ObjectFactoryImpl';
import { ObjectFactoryResult } from '../api/ObjectFactory';
import { CustomScope } from '../api/CustomScope';
import { Utils } from '../Utils';
import { RuntimeErrors } from '../api/RuntimeErrors';
import { BeanKind } from '../../compile-time/core/bean/BeanKind';
import { ClassConstructor } from '../api/ClassConstructor';
import { ApplicationBeanDependency } from './ApplicationBeanDependency';
import { ApplicationConfiguration } from './ApplicationConfiguration';
import { MaybeAsync } from '../types/MaybeAsync';

export class ApplicationBean {
  private proxy: any | null = null;
  public readonly name: string;
  private _objectFactory: ObjectFactoryImpl | null = null;

  get objectFactory(): ObjectFactoryImpl {
    if (this._objectFactory === null) {
      throw new RuntimeErrors.IllegalStateError('Object factory not initialized');
    }

    return this._objectFactory;
  }

  constructor(
    public readonly id: number,
    public readonly parentConfiguration: ApplicationConfiguration,
    public readonly beanClassProperty: string,
    public readonly beanMetadata: RuntimeBeanMetadata,
    public readonly dependencies: ApplicationBeanDependency[] | null,
    public readonly classConstructor: ClassConstructor<any> | null
  ) {
    this.name = `${parentConfiguration.index}_${id}_${beanMetadata.qualifiedName}`;
  }

  init(objectFactory: ObjectFactoryImpl): void {
    this._objectFactory = objectFactory;
  }

  getValue(): MaybeAsync<ObjectFactoryResult> {
    const scope = this.getScope();
    const useProxy = scope.useProxy?.() ?? true;

    if (useProxy) {
      return this.getProxyBean();
    }

    return this.getBeanFromScope();
  }

  get lazy(): boolean {
    return this.beanMetadata.lazy ?? this.parentConfiguration.metadata.lazy;
  }

  get scopeName(): string | number {
    return this.beanMetadata.scope ?? this.parentConfiguration.metadata.scope;
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

  private assertNotPrimitiveAndConstruct(): any {
    const bean = this.getBeanFromScope();

    if (Utils.isObject(bean)) {
      return bean;
    }

    const msg =
      `Bean named "${this.name}", with scope: "${this.scopeName}" - ` +
      'contains primitive value which could not be wrapped in Proxy, ' +
      'ES standard allows only object proxies.' +
      'To solve this issue - you can wrap your primitive value in object.';

    throw new RuntimeErrors.PrimitiveCouldNotBeWrappedInProxyError(msg);
  }

  private getProxyBean(): any {
    if (!this.proxy) {
      this.proxy = new Proxy({}, {
        apply: (_: any, thisArg: any, argArray: any[]) => {
          return Reflect.apply(this.assertNotPrimitiveAndConstruct(), thisArg, argArray);
        },
        construct: (_: any, argArray: any[], newTarget: Function): object => {
          return Reflect.construct(this.assertNotPrimitiveAndConstruct(), argArray, newTarget);
        },
        defineProperty: (_: any, property: string | symbol, attributes: PropertyDescriptor): boolean => {
          return Reflect.defineProperty(this.assertNotPrimitiveAndConstruct(), property, attributes);
        },
        deleteProperty: (_: any, property: string | symbol): boolean => {
          return Reflect.deleteProperty(this.assertNotPrimitiveAndConstruct(), property);
        },
        get: (_: any, property: string | symbol, receiver: any) => {
          return Reflect.get(this.assertNotPrimitiveAndConstruct(), property, receiver);
        },
        getOwnPropertyDescriptor: (_: any, property: string | symbol): PropertyDescriptor | undefined => {
          return Reflect.getOwnPropertyDescriptor(this.assertNotPrimitiveAndConstruct(), property);
        },
        getPrototypeOf: (_: any): object | null => {
          return Reflect.getPrototypeOf(this.assertNotPrimitiveAndConstruct());
        },
        has: (_: any, property: string | symbol): boolean => {
          return Reflect.has(this.assertNotPrimitiveAndConstruct(), property);
        },
        isExtensible: (_: any): boolean => {
          return Reflect.isExtensible(this.assertNotPrimitiveAndConstruct());
        },
        ownKeys: (_: any): ArrayLike<string | symbol> => {
          return Reflect.ownKeys(this.assertNotPrimitiveAndConstruct());
        },
        preventExtensions: (_: any): boolean => {
          return Reflect.preventExtensions(this.assertNotPrimitiveAndConstruct());
        },
        set: (_: any, property: string | symbol, newValue: any, receiver: any): boolean => {
          return Reflect.set(this.assertNotPrimitiveAndConstruct(), property, newValue, receiver);
        },
        setPrototypeOf: (_: any, value: object | null): boolean => {
          return Reflect.setPrototypeOf(this.assertNotPrimitiveAndConstruct(), value);
        }
      });
    }

    return this.proxy;
  }
}
