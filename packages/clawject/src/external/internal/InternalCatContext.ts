import { ErrorBuilder } from '../ErrorBuilder';
import { LifecycleKind } from '../../core/component-lifecycle/LifecycleKind';
import { RuntimeElement } from '../../core/runtime-element/RuntimeElement';
import { RuntimeLifecycleConfiguration } from '../../core/component-lifecycle/RuntimeLifecycleConfiguration';
import { InternalBeanConfig, RuntimeBeanConfiguration } from '../../core/bean/RuntimeBeanConfiguration';

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
        return (context.constructor)[RuntimeElement.METADATA];
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

    static getBeansConfig(context: InternalCatContext): Record<BeanName, Partial<InternalBeanConfig>> {
        return this.getStaticMetadata(context).beanConfiguration;
    }

    [RuntimeElement.INIT](contextConfig: any): void {
        this[RuntimeElement.CONFIG] = contextConfig;
    }

    [RuntimeElement.POST_CONSTRUCT](): void {
        InternalCatContext.getLifecycleMethods(this, LifecycleKind.POST_CONSTRUCT)?.forEach(methodName => {
            this[methodName]();
        });
    }

    [RuntimeElement.BEFORE_DESTRUCT](): void {
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
            return this[beanName]();
        }

        const savedInstance = this[RuntimeElement.SINGLETON_MAP].get(beanName) ?? this[beanName]();

        if (!this[RuntimeElement.SINGLETON_MAP].has(beanName)) {
            this[RuntimeElement.SINGLETON_MAP].set(beanName, savedInstance);
        }

        return savedInstance;
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
                acc[curr] = this[RuntimeElement.GET_BEAN](curr);

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
