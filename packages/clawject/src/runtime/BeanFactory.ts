import { ErrorBuilder } from './ErrorBuilder';
import { InternalScopeRegister } from './scope/InternalScopeRegister';
import { ObjectFactoryImpl } from './object-factory/ObjectFactoryImpl';
import { Callback } from './types/Callback';
import { LifecycleKind } from './LifecycleKind';
import { RuntimeErrors } from './errors';
import { RuntimeBeanMetadata } from './metadata/MetadataTypes';
import { RuntimeContextFactoriesMetadata, RuntimeContextMetadata } from './metadata/RuntimeContextMetadata';
import { MetadataStorage } from './metadata/MetadataStorage';
import { InternalUtils } from './InternalUtils';

export class BeanFactory {
  private proxyRegister = new Map<string, any>();

  constructor(
    private runtimeContextMetadata: RuntimeContextMetadata,
    private factories: RuntimeContextFactoriesMetadata,
  ) {
  }

  public getPublicBean(name: string): any {
    const beanConfig = this.getBeanConfig(name);

    if (!beanConfig.public) {
      console.warn(`Bean ${name} is not defined in Context's interface. This Bean will not be checked for type matching with Context's interface at compile-time. Context: ${this.runtimeContextMetadata.className}`);
    }

    return this.getBean(name);
  }

  public getPublicBeans(): Record<string, any> {
    const result: Record<string, any> = {};

    Object.entries(this.runtimeContextMetadata.beans).forEach(([beanName, beanConfig]) => {
      if (beanConfig.public) {
        result[beanName] = this.getBean(beanName);
      }
    });

    return result;
  }

  getAllBeans(): Map<string, any> {
    const result = new Map<string, any>();

    Object.keys(this.runtimeContextMetadata.beans).forEach(beanName => {
      result.set(beanName, this.getBean(beanName));
    });

    return result;
  }

  getBean(name: string): any {
    const beanConfig = this.getBeanConfig(name);
    const scopeName = beanConfig.scope ?? this.runtimeContextMetadata.scope;
    const scope = InternalScopeRegister.getScope(scopeName);
    const objectFactory = new ObjectFactoryImpl(() => {
      const elementFactory = this.getElementFactory(name);
      const instantiatedBean = elementFactory();

      this.onComponentLifecycle(instantiatedBean, LifecycleKind.POST_CONSTRUCT);

      return instantiatedBean;
    });

    const scopedBeanName = this.buildScopedBeanName(name);

    const useProxy = scope.useProxy?.() ?? true;

    const registerPreDestroyCallback = (beanInstance: any) => {
      const componentMetadata = MetadataStorage.getComponentMetadataByClassInstance(beanInstance);
      const hasLifecyclePreDestroy = componentMetadata !== null && componentMetadata.lifecycle.PRE_DESTROY.length > 0;

      if (hasLifecyclePreDestroy) {
        scope.registerDestructionCallback(scopedBeanName, this.getBeanDestructionCallback(beanInstance));
      }
    };

    let bean: any;

    if (useProxy) {
      bean = this.getOrBuildBeanProxy(
        name,
        scopeName,
        () => scope.get(scopedBeanName, objectFactory),
        registerPreDestroyCallback,
      );
    } else {
      bean = scope.get(scopedBeanName, objectFactory);
      registerPreDestroyCallback(bean);
    }

    return bean;
  }

  destroyBean(name: string): void {
    const beanConfig = this.getBeanConfig(name);
    const scope = InternalScopeRegister.getScope(beanConfig.scope ?? this.runtimeContextMetadata.scope);

    //TODO check if there could be memory leakage
    this.proxyRegister.delete(name);

    const removedInstance = scope.remove(this.buildScopedBeanName(name));

    if (removedInstance !== null) {
      const destructionCallback = this.getBeanDestructionCallback(removedInstance);
      destructionCallback();
    }
  }

  private getBeanDestructionCallback(instance: any): Callback {
    return (): void => this.onComponentLifecycle(instance, LifecycleKind.PRE_DESTROY);
  }

  private onComponentLifecycle(instance: any, lifecycleKind: LifecycleKind): void {
    if (!instance) {
      return;
    }

    MetadataStorage.getComponentMetadataByClassInstance(instance)?.lifecycle[lifecycleKind].forEach(methodName => {
      instance[methodName]();
    });
  }

  private getBeanConfig(name: string): RuntimeBeanMetadata {
    const beanConfig = this.runtimeContextMetadata.beans[name];

    if (!beanConfig) {
      throw ErrorBuilder.beanNotFound(this.runtimeContextMetadata.className, name);
    }

    return beanConfig;
  }

  private getElementFactory(name: string): () => any {
    const elementFactory = this.factories[name];

    if (!elementFactory) {
      throw ErrorBuilder.noContextMemberFactoryFound(this.runtimeContextMetadata.className, name);
    }

    return elementFactory;
  }

  private buildScopedBeanName(name: string): string {
    if (this.runtimeContextMetadata.id === null) {
      return name;
    }

    return `${this.runtimeContextMetadata.id}_${name}`;
  }

  private getOrBuildBeanProxy(
    name: string,
    scopeName: string,
    scopeBeanGetter: () => any,
    registerPreDestroyCallback: (beanInstance: any) => void
  ): any {
    let proxy = this.proxyRegister.get(name);

    const assertNotPrimitiveAndConstruct = () => {
      const bean = scopeBeanGetter();

      if (InternalUtils.isObject(bean)) {
        registerPreDestroyCallback(bean);

        return bean;
      }

      const msg =
        `Bean named "${name}", with scope: "${scopeName}" - ` +
        'contains primitive value which could not be wrapped in Proxy, ' +
        'ES standard allows only object proxies.' +
        'To solve this issue - you can wrap your primitive value in object.';

      throw new RuntimeErrors.PrimitiveCouldNotBeWrappedInProxyError(msg);
    };

    if (!proxy) {
      const proxyHandler: Required<ProxyHandler<any>> = {
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
      };

      proxy = new Proxy({}, proxyHandler);
    }

    this.proxyRegister.set(name, proxy);

    return proxy;
  }
}
