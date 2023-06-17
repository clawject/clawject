import { ErrorBuilder } from './ErrorBuilder';

export interface IBeanConfig {
    scope: 'prototype' | 'singleton';
    isPublic: boolean;
}

type BeanName = string;

export type BeanLifecycle = 'post-construct' | 'before-destruct';

export interface ClawjectStatic {
    contextName: string;
    beanConfiguration: Record<BeanName, Partial<IBeanConfig>>;
    lifecycleConfiguration: Partial<Record<BeanLifecycle, BeanName[]>>;
}

export abstract class InternalCatContext {
    [beanName: string]: any;

    static reservedNames = new Set([
        'clawject_static',

        'clawject_postConstruct',
        'clawject_beforeDestruct',
        'clawject_init',
        'clawject_singletonMap',
        'clawject_config',
        'config',
        'clawject_getBean',
        'clawject_getBeans',
        'clawject_getPrivateBean',

        'clawject_createSet',
        'clawject_createMap',
    ]);

    private static getStaticContextProperties(context: InternalCatContext): Partial<ClawjectStatic> {
        return (context.constructor)['clawject_static'];
    }

    private static getContextName(context: InternalCatContext): string {
        return this.getStaticContextProperties(context)?.contextName || '<anonymous>';
    }

    private static getLifecycleMethods(context: InternalCatContext, lifecycle: BeanLifecycle): BeanName[] | undefined {
        return this.getStaticContextProperties(context)?.lifecycleConfiguration?.[lifecycle];
    }

    private static getBeanConfig(context: InternalCatContext, beanName: BeanName): IBeanConfig {
        const beanConfiguration = this.getStaticContextProperties(context)?.beanConfiguration?.[beanName];

        if (!beanConfiguration) {
            throw ErrorBuilder.beanNotFoundInContext(this.getContextName(context), beanName);
        }

        return {
            scope: 'singleton',
            isPublic: false,
            ...beanConfiguration,
        };
    }

    static getBeansConfig(context: InternalCatContext): Record<BeanName, Partial<IBeanConfig>> {
        return this.getStaticContextProperties(context)?.beanConfiguration ?? {};
    }

    clawject_init(contextConfig: any): void {
        this.clawject_config = contextConfig;
    }

    clawject_postConstruct(): void {
        InternalCatContext.getLifecycleMethods(this, 'post-construct')?.forEach(methodName => {
            this[methodName]();
        });
    }

    clawject_beforeDestruct(): void {
        InternalCatContext.getLifecycleMethods(this, 'before-destruct')?.forEach(methodName => {
            this[methodName]();
        });
    }

    private clawject_singletonMap = new Map<BeanName, any>();

    private clawject_config: any = null;

    get config(): any {
        return this.clawject_config;
    }

    clawject_getBean<T>(beanName: BeanName): T {
        const beanConfiguration = InternalCatContext.getBeanConfig(this, beanName);

        if (!beanConfiguration.isPublic) {
            const contextName = InternalCatContext.getContextName(this);

            console.warn(`Bean ${beanName} is not defined in Context's interface.\nThis Bean will not be checked for type matching with Context's interface at compile-time.\nContext: ${contextName}`);
        }

        return this.clawject_getPrivateBean(beanName);
    }

    protected clawject_getPrivateBean<T>(beanName: BeanName): T {
        const beanConfiguration = InternalCatContext.getBeanConfig(this, beanName);

        if (beanConfiguration.scope !== 'singleton') {
            return this[beanName]();
        }

        const savedInstance = this.clawject_singletonMap.get(beanName) ?? this[beanName]();

        if (!this.clawject_singletonMap.has(beanName)) {
            this.clawject_singletonMap.set(beanName, savedInstance);
        }

        return savedInstance;
    }

    clawject_getBeans(): any {
        const beansConfig = InternalCatContext.getBeansConfig(this);

        return Object.keys(beansConfig)
            .reduce((acc, curr) => {
                if (beansConfig[curr].isPublic) {
                    acc[curr] = this.clawject_getBean(curr);
                }

                return acc;
            }, {});
    }

    protected clawject_createSet<V>(values: V[]): Set<V> {
        return new Set(values);
    }

    protected clawject_createMap<K, V>(values: [K, V][]): Map<K, V> {
        return new Map(values);
    }
}
