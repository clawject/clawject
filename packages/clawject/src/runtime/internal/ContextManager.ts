import { CatContext } from '../CatContext';
import { ClassConstructor } from '../ClassConstructor';
import { ErrorBuilder } from '../ErrorBuilder';
import { BeanFactory } from './BeanFactory';
import { RuntimeBeanMetadata } from '../runtime-elements/RuntimeBeanMetadata';
import { getStaticRuntimeElementFromInstanceConstructor } from '../utils/getStaticRuntimeElementFromInstanceConstructor';
import { StaticRuntimeElement } from '../runtime-elements/StaticRuntimeElement';
import { RuntimeLifecycleMetadata } from '../runtime-elements/RuntimeLifecycleMetadata';
import { ScopeRegister } from '../scope/ScopeRegister';
import { getInstanceRuntimeElementFromInstance } from '../utils/getInstanceRuntimeElementFromInstance';
import { InstanceRuntimeElement } from '../runtime-elements/InstanceRuntimeElement';

export interface ContextManagerConfig {
  id: string;
  contextName: string;
  contextConstructor: ClassConstructor<CatContext>;
  lifecycle: RuntimeLifecycleMetadata;
  beans: Record<string, RuntimeBeanMetadata>;
  lazy: boolean;
}

export class ContextManager {
  declare public metadata: ContextManagerConfig;
  private contextPool = new Map<any, CatContext>();
  private configPool = new Map<CatContext, any>();
  private beanFactories = new Map<CatContext, BeanFactory>();

  constructor(metadata: ContextManagerConfig) {
    Object.defineProperty(this, 'metadata', {
      get(): ContextManagerConfig {
        return metadata;
      },
      enumerable: false,
      configurable: false,
    });
  }

  public static createSet<T>(values: T[]): Set<T> {
    return new Set(values);
  }

  public static createMap<K, V>(values: [K, V][]): Map<K, V> {
    return new Map(values);
  }

  public static extractManagerFromInstance(instance: CatContext<any, any>): ContextManager {
    const contextManager = getStaticRuntimeElementFromInstanceConstructor(
      instance,
      StaticRuntimeElement.CONTEXT_MANAGER
    );

    if (!contextManager) {
      throw ErrorBuilder.usageWithoutConfiguredDI();
    }

    return contextManager;
  }

  public static getConfigForInstance(instance: CatContext<any, any>): any {
    const contextManager = this.extractManagerFromInstance(instance);

    return contextManager.configPool.get(instance);
  }

  public static getPrivateBeanFromFactory(beanName: string, instance: CatContext<any, any>): any {
    const contextManager = this.extractManagerFromInstance(instance);

    if (!contextManager) {
      throw ErrorBuilder.usageWithoutConfiguredDI();
    }

    return contextManager.beanFactories.get(instance)?.getBean(beanName);
  }

  public getBeanFactoryOrThrow(instance: CatContext): BeanFactory {
    const beanFactory = this.beanFactories.get(instance);

    if (!beanFactory) {
      throw ErrorBuilder.usageWithoutConfiguredDI();
    }

    return beanFactory;
  }

  public instantiateContext(key: any, config: any): any {
    Object.values(this.metadata.beans)
      .forEach(it => ScopeRegister.assureRegistered(it.scope));

    const instance = new this.metadata.contextConstructor();

    this.contextPool.set(key, instance);
    this.configPool.set(instance, config);
    this.beanFactories.set(instance, new BeanFactory(
      this.metadata.id,
      this.metadata.contextName,
      instance,
      this.metadata.beans,
    ));

    this.postConstruct(instance);

    return instance;
  }

  public getInstanceOrInstantiate(key: any, config: any): CatContext {
    return this.contextPool.get(key) ?? this.instantiateContext(key, config);
  }

  public getInstanceOrThrow(key: any): CatContext {
    const instance = this.contextPool.get(key);

    if (!instance) {
      throw ErrorBuilder.noContextByKey(this.metadata.contextName, key);
    }

    return instance;
  }

  public dispose(key: any): void {
    const instance = this.contextPool.get(key);

    if (!instance) {
      console.warn(`Context ${this.metadata.contextName} with key ${key} not found`);
      return;
    }

    this.contextPool.delete(key);
    this.configPool.delete(instance);
    this.preDestroy(instance);
  }

  private postConstruct(instance: CatContext): void {
    Object.entries(this.metadata.beans).forEach(([beanName, beanConfig]) => {
      const isBeanLazy = beanConfig.lazy === null ? this.metadata.lazy : beanConfig.lazy;

      if (!isBeanLazy && beanConfig.scope === 'singleton') {
        this.beanFactories.get(instance)?.getBean(beanName);
      }
    });
    this.metadata.lifecycle.POST_CONSTRUCT?.forEach((methodName) => {
      this.getElementFactory(instance, methodName)();
    });
  }

  private preDestroy(instance: CatContext): void {
    Object.keys(this.metadata.beans).forEach(beanName => {
      this.beanFactories.get(instance)?.destroyBean(beanName);
    });

    this.metadata.lifecycle.PRE_DESTROY?.forEach((methodName) => {
      this.getElementFactory(instance, methodName)();
    });
  }

  private getElementFactory(instance: CatContext, name: string): () => any {
    const elementFactory =
      getInstanceRuntimeElementFromInstance(instance, InstanceRuntimeElement.CONTEXT_ELEMENT_FACTORIES)?.[name];

    if (!elementFactory) {
      throw ErrorBuilder.noElementFactoryFound(this.metadata.contextName, name);
    }

    return elementFactory;
  }
}