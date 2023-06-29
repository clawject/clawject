import { ErrorBuilder } from '../ErrorBuilder';
import { LifecycleKind } from '../../core/component-lifecycle/LifecycleKind';
import { RuntimeElement } from '../../core/runtime-element/RuntimeElement';
import { RuntimeLifecycleConfiguration } from '../../core/component-lifecycle/RuntimeLifecycleConfiguration';
import { InternalBeanConfig, RuntimeBeanConfiguration } from '../../core/bean/RuntimeBeanConfiguration';
import { getConstructor } from './utils';
import { RuntimeComponentConfiguration } from '../../core/component/RuntimeComponentConfiguration';

type BeanName = string;

export interface ClawjectContextMetadata extends RuntimeLifecycleConfiguration, RuntimeBeanConfiguration {
    contextName: string;
}

export abstract class InternalCatContext {
    [element: BeanName | RuntimeElement]: any;

    //Implementation of CatContext interface
    private [RuntimeElement.CONFIG]: any = null;
    protected get [RuntimeElement.CAT_CONTEXT_CONFIG](): any {
        return this[RuntimeElement.CONFIG];
    }
    protected get [RuntimeElement.CAT_CONTEXT_CONTEXT](): any {
        throw ErrorBuilder.illegalAccess('CatContext.context');
    }

    static getStaticMetadata(context: InternalCatContext): ClawjectContextMetadata {
        const constructor = getConstructor(context);

        if (!constructor) {
            throw ErrorBuilder.constructorNotFound('Inheritor of CatContext');
        }

        return constructor[RuntimeElement.METADATA];
    }

    static getContextName(context: InternalCatContext): string {
        return this.getStaticMetadata(context).contextName || '<anonymous>';
    }

    static getLifecycleMethods(context: InternalCatContext, lifecycle: LifecycleKind): BeanName[] | undefined {
        return this.getStaticMetadata(context).lifecycleConfiguration[lifecycle];
    }

    static getBeanConfig(context: InternalCatContext, beanName: BeanName): InternalBeanConfig {
        const beanConfiguration = this.getStaticMetadata(context).beanConfiguration[beanName];

        if (!beanConfiguration) {
            throw ErrorBuilder.beanNotFoundInContext(this.getContextName(context), beanName);
        }

        return {
            scope: 'singleton',
            public: false,
            ...beanConfiguration,
        };
    }

    static getBeansConfig(context: InternalCatContext): Record<BeanName, InternalBeanConfig> {
        return Object.keys(this.getStaticMetadata(context).beanConfiguration).reduce((acc, beanName) => {
            acc[beanName] = this.getBeanConfig(context, beanName);

            return acc;
        }, {});
    }

    [RuntimeElement.INIT](contextConfig: any): void {
        this[RuntimeElement.CONFIG] = contextConfig;
    }

    [RuntimeElement.POST_CONSTRUCT](): void {
        Object.entries(InternalCatContext.getBeansConfig(this)).forEach(([beanName, beanConfig]) => {
            if (beanConfig.lazy || beanConfig.scope !== 'singleton') {
                return;
            }

            this[RuntimeElement.GET_PRIVATE_BEAN](beanName);
        });
        this[RuntimeElement.GET_ALL_BEANS]();
        InternalCatContext.getLifecycleMethods(this, LifecycleKind.POST_CONSTRUCT)?.forEach(methodName => {
            this[methodName]();
        });
    }

    [RuntimeElement.BEFORE_DESTRUCT](): void {
        Object.entries(InternalCatContext.getBeansConfig(this)).forEach(([beanName, beanConfig]) => {
            const instance = this[RuntimeElement.SINGLETON_MAP].get(beanName);

            if (!instance || beanConfig.scope !== 'singleton') {
                return;
            }

            InternalCatContext.onComponentLifecycle(instance, LifecycleKind.BEFORE_DESTRUCT);
        });

        InternalCatContext.getLifecycleMethods(this, LifecycleKind.BEFORE_DESTRUCT)?.forEach(methodName => {
            this[methodName]();
        });
    }

    private [RuntimeElement.SINGLETON_MAP] = new Map<BeanName, any>();

    [RuntimeElement.GET_BEAN]<T>(beanName: BeanName): T {
        const beanConfiguration = InternalCatContext.getBeanConfig(this, beanName);

        if (!beanConfiguration.public) {
            const contextName = InternalCatContext.getContextName(this);

            console.warn(`Bean ${beanName} is not defined in Context's interface.\nThis Bean will not be checked for type matching with Context's interface at compile-time.\nContext: ${contextName}`);
        }

        return this[RuntimeElement.GET_PRIVATE_BEAN](beanName);
    }

    protected [RuntimeElement.GET_PRIVATE_BEAN]<T>(beanName: BeanName): T {
        const beanConfiguration = InternalCatContext.getBeanConfig(this, beanName);

        if (beanConfiguration.scope !== 'singleton') {
            const newInstance = this[beanName]();
            InternalCatContext.onComponentLifecycle(newInstance, LifecycleKind.POST_CONSTRUCT);

            return newInstance;
        }

        let instance = this[RuntimeElement.SINGLETON_MAP].get(beanName);

        if (!instance) {
            instance = this[beanName]();
            InternalCatContext.onComponentLifecycle(instance, LifecycleKind.POST_CONSTRUCT);
        }

        this[RuntimeElement.SINGLETON_MAP].set(beanName, instance);

        return instance;
    }

    private static onComponentLifecycle(instance: any, lifecycleKind: LifecycleKind): void {
        if (!instance) {
            return;
        }

        const instanceConstructor = getConstructor(instance);

        if (!instanceConstructor) {
            return;
        }

        const implicitComponentMetadata =
            instanceConstructor[RuntimeElement.METADATA] as RuntimeComponentConfiguration | undefined;

        if (!implicitComponentMetadata) {
            return;
        }

        implicitComponentMetadata.lifecycleConfiguration[lifecycleKind].forEach(methodName => {
            instance[methodName]();
        });
    }

    [RuntimeElement.GET_BEANS](): Record<string, unknown> {
        const beansConfig = InternalCatContext.getBeansConfig(this);

        return Object.keys(beansConfig)
            .reduce((acc, curr) => {
                if (beansConfig[curr].public) {
                    acc[curr] = this[RuntimeElement.GET_BEAN](curr);
                }

                return acc;
            }, {});
    }

    [RuntimeElement.GET_ALL_BEANS](): Map<string, unknown> {
        const beansConfig = InternalCatContext.getBeansConfig(this);

        return Object.keys(beansConfig)
            .reduce((acc, curr) => {
                acc.set(curr, this[RuntimeElement.GET_PRIVATE_BEAN](curr));

                return acc;
            }, new Map());
    }

    protected [RuntimeElement.CREATE_SET]<V>(values: V[]): Set<V> {
        return new Set(values);
    }

    protected [RuntimeElement.CREATE_MAP]<K, V>(values: [K, V][]): Map<K, V> {
        return new Map(values);
    }
}
