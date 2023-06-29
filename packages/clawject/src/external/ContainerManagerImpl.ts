import { CatContext } from './CatContext';
import { ContextHolder } from './ContextHolder';
import { Context } from './Context';
import { InternalCatContext } from './internal/InternalCatContext';
import { ContainerManager, ContextInit, ContextInitConfig } from './ContainerManager';
import { ErrorBuilder } from './ErrorBuilder';
import { ClassConstructor } from './ClassConstructor';
import { RuntimeElement } from '../core/runtime-element/RuntimeElement';

const DEFAULT_KEY = undefined;

const DEFAULT_INIT: ContextInit = {
    key: DEFAULT_KEY,
};

export class ContainerManagerImpl implements ContainerManager {
    private pools: Map<{ new(): CatContext<any> }, Map<any, ContextHolder>> = new Map();

    init<T>(context: ClassConstructor<CatContext<T>>, init?: ContextInit): Context<T>;
    init<T, C>(context: ClassConstructor<CatContext<T, C>>, init: ContextInit & ContextInitConfig<C>): Context<T>;
    init(context: ClassConstructor<CatContext<any>>, init: ContextInit & Partial<ContextInitConfig<any>> = DEFAULT_INIT): Context<any> {
        if (!(context.prototype instanceof InternalCatContext)) {
            throw ErrorBuilder.classNotInheritorOfCatContext();
        }

        const pool = this.getPool(context as any);
        const instance = new context() as unknown as InternalCatContext;
        const contextHolder = new ContextHolder(instance);

        if (init.config !== undefined) {
            instance[RuntimeElement.INIT](init.config);
        }

        pool.set(init.key, contextHolder);

        try {
            return contextHolder;
        } finally {
            instance[RuntimeElement.POST_CONSTRUCT]();
        }
    }

    get<T>(context: ClassConstructor<CatContext<T>>, key: any = DEFAULT_KEY): Context<T> {
        if (!(context.prototype instanceof InternalCatContext)) {
            throw ErrorBuilder.classNotInheritorOfCatContext();
        }
        const pool = this.getPool(context as any);
        const contextHolder = pool.get(key);

        if (!contextHolder) {
            const contextName = context[RuntimeElement.METADATA].name;

            throw ErrorBuilder.noContextByKey(contextName, key);
        }

        return contextHolder as any;
    }

    getOrInit<T>(context: ClassConstructor<CatContext<T>>, init?: ContextInit): Context<T>;
    getOrInit<T, C>(context: ClassConstructor<CatContext<T, C>>, init: ContextInit & ContextInitConfig<C>): Context<T>;
    getOrInit<T, C>(context: ClassConstructor<CatContext<any>>, init: ContextInit & Partial<ContextInitConfig<any>> = DEFAULT_INIT): Context<T> {
        if (!(context.prototype instanceof InternalCatContext)) {
            throw ErrorBuilder.classNotInheritorOfCatContext();
        }
        const pool = this.getPool(context as any);
        const contextHolder = pool.get(init.key);

        if (contextHolder) {
            return contextHolder;
        }

        return this.init(context, init);
    }

    clear<T>(context: ClassConstructor<CatContext<T>>, key: any = DEFAULT_KEY): void {
        if (!(context.prototype instanceof InternalCatContext)) {
            throw ErrorBuilder.classNotInheritorOfCatContext();
        }
        const pool = this.getPool(context);
        const contextHolder = pool.get(key);

        if (!contextHolder) {
            return console.warn(`Trying to clear not initialized context, class: ${context}, key: ${ErrorBuilder.contextKeyToString(key)}`);
        }

        try {
            pool.delete(key);

            if (pool.size === 0) {
                this.pools.delete(context);
            }
        } finally {
            contextHolder.instance[RuntimeElement.BEFORE_DESTRUCT]();
        }
    }

    clearAll() {
        this.pools.forEach((pool, context) => {
            pool.forEach((contextHolder) => {
                contextHolder.instance[RuntimeElement.BEFORE_DESTRUCT]();
            });

            this.pools.delete(context);
        });
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
