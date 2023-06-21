import { CatContext } from './CatContext';
import { ContextHolder } from './ContextHolder';
import { Context } from './Context';
import { InternalCatContext } from './internal/InternalCatContext';
import { ContextProps, ContextPropsWithConfig, Container } from './Container';
import { ErrorBuilder } from './ErrorBuilder';

export class ContainerImpl implements Container {
    private pools: Map<{ new(): CatContext<any> }, Map<any, ContextHolder>> = new Map();

    initContext<T>(props: ContextProps<T>): Context<T>;
    initContext<T, C>(props: ContextPropsWithConfig<T, C>): Context<T>;
    initContext<T, C>(props: ContextPropsWithConfig<T, C>): Context<T> {
        if (!(props.context.prototype instanceof InternalCatContext)) {
            throw ErrorBuilder.classNotInheritorOfCatContext();
        }

        const pool = this.getPool(props.context as any);
        const instance = new props.context() as unknown as InternalCatContext;
        const contextHolder = new ContextHolder(instance);

        if (props.config !== undefined) {
            instance.clawject_init(props.config);
        }

        pool.set(props.key, contextHolder);

        try {
            return contextHolder;
        } finally {
            instance.clawject_postConstruct();
        }
    }

    getContext<T>(props: ContextProps<T>): Context<T>;
    getContext<T, C>(props: ContextPropsWithConfig<T, C>): Context<T> {
        if (!(props.context.prototype instanceof InternalCatContext)) {
            throw ErrorBuilder.classNotInheritorOfCatContext();
        }
        const pool = this.getPool(props.context as any);
        const contextHolder = pool.get(props.key);

        if (!contextHolder) {
            throw ErrorBuilder.noContextByKey((props.context as any)['clawject_static_contextName'], props.key);
        }

        return contextHolder as any;
    }

    getOrInitContext<T>(props: ContextProps<T>): Context<T>;
    getOrInitContext<T, C>(props: ContextPropsWithConfig<T, C>): Context<T>;
    getOrInitContext<T, C>(props: ContextPropsWithConfig<T, C>): Context<T> {
        if (!(props.context.prototype instanceof InternalCatContext)) {
            throw ErrorBuilder.classNotInheritorOfCatContext();
        }
        const pool = this.getPool(props.context as any);
        const contextHolder = pool.get(props.key);

        if (contextHolder) {
            return contextHolder;
        }

        return this.initContext(props);
    }

    clearContext<T>(props: ContextProps<T>): void {
        if (!(props.context.prototype instanceof InternalCatContext)) {
            throw ErrorBuilder.classNotInheritorOfCatContext();
        }
        const pool = this.getPool(props.context);
        const contextHolder = pool.get(props.key);

        if (!contextHolder) {
            return console.warn(`Trying to clear not initialized context, class: ${props.context}, key: ${ErrorBuilder.contextKeyToString(props.key)}`);
        }

        try {
            pool.delete(props.key);

            if (pool.size === 0) {
                this.pools.delete(props.context);
            }
        } finally {
            contextHolder.instance.clawject_beforeDestruct();
        }
    }

    private getPool(context: { new(): CatContext<any> }): Map<any, ContextHolder> {
        let pool = this.pools.get(context);

        if (!pool) {
            pool = new Map();
            this.pools.set(context, pool);
        }

        return pool;
    }
}
