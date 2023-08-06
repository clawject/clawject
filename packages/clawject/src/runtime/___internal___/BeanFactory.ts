import { ErrorBuilder } from '../ErrorBuilder';
import { ScopeRegister } from '../scope/ScopeRegister';
import { ObjectFactoryImpl } from '../object-factory/ObjectFactoryImpl';
import { Callback } from '../types/Callback';
import { LifecycleKind } from '../../compile-time/core/component-lifecycle/LifecycleKind';
import { ContextMetadata } from './ContextManager';
import { RuntimeBeanMetadata } from '../runtime-elements/RuntimeBeanMetadata';
import { getStaticRuntimeElementFromInstanceConstructor, StaticRuntimeElement } from '../runtime-elements/StaticRuntimeElement';
import { RuntimeElementFactories } from '../runtime-elements/RuntimeElementFactories';

export class BeanFactory {
  private proxyRegister = new Map<string, any>();

  constructor(
    private id: string | null, // Null in application mode
    private configurationName: string,
    private beans: ContextMetadata['beans'],
    private factories: RuntimeElementFactories,
  ) {}

  public getPublicBean(name: string): any {
    const beanConfig = this.getBeanConfig(name);

    if (!beanConfig.public) {
      console.warn(`Bean ${name} is not defined in Context's interface. This Bean will not be checked for type matching with Context's interface at compile-time. Context: ${this.configurationName}`);
    }

    return this.getBean(name);
  }

  public getPublicBeans(): Record<string, any> {
    const result: Record<string, any> = {};

    Object.entries(this.beans).forEach(([beanName, beanConfig]) => {
      if (beanConfig.public) {
        result[beanName] = this.getBean(beanName);
      }
    });

    return result;
  }

  getAllBeans(): Map<string, any> {
    const result = new Map<string, any>();

    Object.keys(this.beans).forEach(beanName => {
      result.set(beanName, this.getBean(beanName));
    });

    return result;
  }

  getBean(name: string): any {
    const beanConfig = this.getBeanConfig(name);
    const scope = ScopeRegister.getScope(beanConfig.scope);
    const objectFactory = new ObjectFactoryImpl(() => {
      const elementFactory = this.getElementFactory(name);
      const instantiatedBean = elementFactory();

      this.onComponentLifecycle(instantiatedBean, LifecycleKind.POST_CONSTRUCT);

      return instantiatedBean;
    });

    const scopedBeanName = this.buildScopedBeanName(name);

    const useProxy = scope.useProxy?.() ?? true;

    const bean = useProxy
      ? this.getOrBuildBeanProxy(
        name,
        () => scope.get(scopedBeanName, objectFactory),
      )
      : scope.get(scopedBeanName, objectFactory);

    const hasLifecyclePreDestroy = (getStaticRuntimeElementFromInstanceConstructor(
      bean, StaticRuntimeElement.COMPONENT_METADATA
    )?.lifecycle.PRE_DESTROY.length || 0) > 0;

    if (hasLifecyclePreDestroy) {
      scope.registerDestructionCallback(scopedBeanName, this.getBeanDestructionCallback(bean));
    }

    return bean;
  }

  destroyBean(name: string): void {
    const beanConfig = this.getBeanConfig(name);
    const scope = ScopeRegister.getScope(beanConfig.scope);

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

    const implicitComponentMetadata = getStaticRuntimeElementFromInstanceConstructor(
      instance,
      StaticRuntimeElement.COMPONENT_METADATA
    );

    if (!implicitComponentMetadata) {
      return;
    }

    implicitComponentMetadata.lifecycle[lifecycleKind].forEach(methodName => {
      instance[methodName]();
    });
  }

  private getBeanConfig(name: string): RuntimeBeanMetadata {
    const beanConfig = this.beans[name];

    if (!beanConfig) {
      throw ErrorBuilder.beanNotFoundInContext(this.configurationName, name);
    }

    return beanConfig;
  }

  private getElementFactory(name: string): () => any {
    const elementFactory = this.factories[name];

    if (!elementFactory) {
      throw ErrorBuilder.noElementFactoryFound(this.configurationName, name);
    }

    return elementFactory;
  }

  private buildScopedBeanName(name: string): string {
    if (this.id === null) {
      return name;
    }

    return `${this.id}_${name}`;
  }

  private getOrBuildBeanProxy(name: string, scopeBeanGetter: () => any): any {
    let proxy = this.proxyRegister.get(name);

    if (!proxy) {
      const proxyHandler: Required<ProxyHandler<any>> = {
        apply: (_: any, thisArg: any, argArray: any[]) => {
          return Reflect.apply(scopeBeanGetter(), thisArg, argArray);
        },
        construct: (_: any, argArray: any[], newTarget: Function): object => {
          return Reflect.construct(scopeBeanGetter(), argArray, newTarget);
        },
        defineProperty: (_: any, property: string | symbol, attributes: PropertyDescriptor): boolean => {
          return Reflect.defineProperty(scopeBeanGetter(), property, attributes);
        },
        deleteProperty: (_: any, property: string | symbol): boolean => {
          return Reflect.deleteProperty(scopeBeanGetter(), property);
        },
        get: (_: any, property: string | symbol, receiver: any) => {
          return Reflect.get(scopeBeanGetter(), property, receiver);
        },
        getOwnPropertyDescriptor: (_: any, property: string | symbol): PropertyDescriptor | undefined => {
          return Reflect.getOwnPropertyDescriptor(scopeBeanGetter(), property);
        },
        getPrototypeOf: (_: any): object | null => {
          return Reflect.getPrototypeOf(scopeBeanGetter());
        },
        has: (_: any, property: string | symbol): boolean => {
          return Reflect.has(scopeBeanGetter(), property);
        },
        isExtensible: (_: any): boolean => {
          const bean = scopeBeanGetter();

          if (bean !== null && typeof bean === 'object') {
            return Reflect.isExtensible(scopeBeanGetter());
          }

          return Object.isExtensible(bean);
        },
        ownKeys: (_: any): ArrayLike<string | symbol> => {
          return Reflect.ownKeys(scopeBeanGetter());
        },
        preventExtensions: (_: any): boolean => {
          const bean = scopeBeanGetter();

          if (bean !== null && typeof bean === 'object') {
            return Reflect.preventExtensions(bean);
          }

          Object.preventExtensions(bean);

          return !Reflect.isExtensible(bean);
        },
        set: (_: any, property: string | symbol, newValue: any, receiver: any): boolean => {
          return Reflect.set(scopeBeanGetter(), property, newValue, receiver);
        },
        setPrototypeOf: (_: any, value: object | null): boolean => {
          return Reflect.setPrototypeOf(scopeBeanGetter(), value);
        }
      };

      proxy = new Proxy({}, proxyHandler);
    }

    this.proxyRegister.set(name, proxy);

    return proxy;
  }
}
