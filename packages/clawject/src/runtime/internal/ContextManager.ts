import { CatContext } from '../CatContext';
import { ClassConstructor } from '../ClassConstructor';
import { ErrorBuilder } from '../ErrorBuilder';
import { BeanFactory } from './BeanFactory';
import { RuntimeBeanMetadata } from '../runtime-elements/RuntimeBeanMetadata';
import { getStaticRuntimeElementFromInstanceConstructor } from '../utils/getStaticRuntimeElementFromInstanceConstructor';
import { RuntimeElement } from '../runtime-elements/RuntimeElement';
import { RuntimeLifecycleMetadata } from '../runtime-elements/RuntimeLifecycleMetadata';
import { ScopeRegister } from '../scope/ScopeRegister';

export interface ContextManagerConfig {
    id: string;
    contextName: string;
    contextConstructor: ClassConstructor<CatContext>;
    lifecycle: RuntimeLifecycleMetadata;
    beans: Record<string, RuntimeBeanMetadata>;
}

export class ContextManager {
    declare public metadata: ContextManagerConfig;

    constructor(metadata: ContextManagerConfig) {
        Object.defineProperty(this, 'metadata', {
            get(): ContextManagerConfig {
                return metadata;
            },
            enumerable: false,
            configurable: false,
        });
    }

    private contextPool = new Map<any, CatContext>();
    private configPool = new Map<CatContext, any>();
    private beanFactories = new Map<CatContext, BeanFactory>();

    public static createSet<T>(values: T[]): Set<T> {
        return new Set(values);
    }

    public static createMap<K, V>(values: [K, V][]): Map<K, V> {
        return new Map(values);
    }

    public static extractManagerFromInstance(instance: CatContext<any, any>): ContextManager {
        const contextManager = getStaticRuntimeElementFromInstanceConstructor(
            instance,
            RuntimeElement.CONTEXT_MANAGER
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
            this.metadata.beans
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
        this.beforeDestruct(instance);
    }

    private postConstruct(instance: CatContext): void {
        Object.entries(this.metadata.beans).forEach(([beanName, beanConfig]) => {
            if (!beanConfig.lazy && beanConfig.scope === 'singleton') {
                this.beanFactories.get(instance)?.getBean(beanName);
            }
        });
        this.metadata.lifecycle.POST_CONSTRUCT?.forEach((methodName) => {
            instance[methodName]();
        });
    }

    private beforeDestruct(instance: CatContext): void {
        Object.keys(this.metadata.beans).forEach(beanName => {
            this.beanFactories.get(instance)?.destroyBean(beanName);
        });

        this.metadata.lifecycle.BEFORE_DESTRUCT?.forEach((methodName) => {
            instance[methodName]();
        });
    }
}
