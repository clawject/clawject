import { Context } from './Context';
import { CatContext } from './CatContext';
import { ContainerImpl } from './ContainerImpl';
import { ClassConstructor } from './ClassConstructor';

/**
 * Context initialization configuration object.
 *
 * @example Init context:
 * class MyContext extends CatContext {}
 *
 * const context = Container.initContext({ context: MyContext });
 * const beans = context.getBeans();
 *
 * @example Init context with key:
 * class MyContext extends CatContext {}
 *
 * const myKey = Symbol('my-context');
 * const context = Container.initContext({ context: MyContext, key: myKey });
 * const beans = context.getBeans();
 *
 * @see {@link Container#initContext}
 * @see {@link Context#getBeans}
 * */
export interface ContextProps<T, C = null> {
    /**
     * Class that extends {@link CatContext CatContext}.
     * */
    context: ClassConstructor<CatContext<T, C>>;

    /**
     * Key by which context will be stored in memory.
     *
     * Used to get or clear context via {@link Container#getContext} {@link Container#getOrInitContext} {@link Container#clearContext}.
     * */
    key?: any;
}

/**
 * Context initialization configuration object with additional config property.
 *
 * @example Init context with config:
 * class MyContext extends CatContext {}
 *
 * const myConfig = { foo: 'bar' };
 * const context = Container.initContext({ context: MyContext, config: myConfig });
 * const beans = context.getBeans();
 *
 * @example Init context with key and config:
 * class MyContext extends CatContext {}
 *
 * const myConfig = { foo: 'bar' };
 * const myKey = Symbol('my-context');
 * const context = Container.initContext({ context: MyContext, key: myKey, config: myConfig });
 * const beans = context.getBeans();
 *
 * @see {@link Container#initContext}
 * @see {@link Context#getBeans}
 * */
export interface ContextPropsWithConfig<T, C> extends ContextProps<T, C> {
    /**
     * Config can be any object.
     *
     * Will be available in {@link CatContext} inheritor via {@link CatContext#config}.
     * */
    config: C extends null ? never : C;
}

/**
 * Container is a main entry point to work with DI.
 *
 * You can use Container to initialize, get or clear contexts.
 *
 * You can use this object anywhere in your code.
 * */
export interface Container {
    /**
     * Initializing CatContext and returns {@link Context} object.
     *
     * If context was already initialized but not cleared - new context will be instantiated and putted in cache instead of old one.
     * Not clearing context can cause memory leaks.
     *
     * @example Init context:
     * class MyContext extends CatContext {}
     *
     * const context = Container.initContext({ context: MyContext });
     *
     * @example Init context but not clearing it:
     * class MyContext extends CatContext {}
     *
     * Container.initContext({ context: MyContext });
     * const context = Container.initContext({ context: MyContext });
     */
    initContext<T>(props: ContextProps<T>): Context<T>;
    initContext<T, C>(props: ContextPropsWithConfig<T, C>): Context<T>;

    /**
     * Returning {@link Context Context} object if it was initialized, if not - throws error with context name and key from {@link ContextProps}.
     *
     * @example Get context:
     * class MyContext extends CatContext {}
     *
     * Container.initContext({ context: MyContext });
     * const context = Container.getContext({ context: MyContext });
     *
     * @example Get context by key:
     * class MyContext extends CatContext {}
     *
     * const myKey = Symbol('my-context');
     *
     * Container.initContext({ context: MyContext, key: myKey });
     * const context = Container.getContext({ context: MyContext, key: myKey });
     *
     * @example Get context but not initializing it:
     * class MyContext extends CatContext {}
     *
     * Container.initContext({ context: MyContext });
     *
     * const myKey = Symbol('my-context');
     * try {
     *     const context = Container.getContext({ context: MyContext, key: myKey });
     * } catch (error) {
     *     console.log(error.message); // <-- Will print "Context 'MyContext' with key 'Symbol(my-context)' is not initialized"
     * }
     */
    getContext<T>(props: ContextProps<T>): Context<T>;

    /**
     * Returning already initialized {@link Context Context} object if it was initialized, if not - builds new context object.
     *
     * @example Get and init context:
     * class MyContext extends CatContext {}
     *
     * const context1 = Container.getOrInitContext({ context: MyContext });
     * const context2 = Container.getOrInitContext({ context: MyContext });
     *
     * console.log(context1 === context2); // <-- Will print "true"
     *
     * @example Get and init context by key:
     * class MyContext extends CatContext {}
     *
     * const myKey = Symbol('my-context');
     *
     * const context1 = Container.getOrInitContext({ context: MyContext, key: myKey });
     * const context2 = Container.getOrInitContext({ context: MyContext, key: myKey });
     *
     * console.log(context1 === context2); // <-- Will print "true"
     *
     * @example Get and init context with different config objects:
     * export interface IMyContext {}
     * class MyContext extends CatContext<IMyContext, { foo: string }> {}
     *
     * const config1 = { foo: 'bar' };
     * const config2 = { foo: 'foo' };
     *
     * const context1 = Container.getOrInitContext({ context: MyContext, config: config1 });
     * const context2 = Container.getOrInitContext({ context: MyContext, config: config2 });
     *
     * console.log(context1 === context2); // <-- Will print "true", and context2 will not re-assign config until you will not clear context and initialize it again with another config
     */
    getOrInitContext<T>(props: ContextProps<T>): Context<T>;
    getOrInitContext<T, C>(props: ContextPropsWithConfig<T, C>): Context<T>;

    /**
     * Clearing initialized context, if initialized context was not found - prints warn to the console.
     *
     * @example Clear context:
     * class MyContext extends CatContext {}
     *
     * Container.initContext({ context: MyContext });
     *
     * Container.clearContext({ context: MyContext });
     *
     * @example Clear context by key:
     * class MyContext extends CatContext {}
     *
     * const myKey = Symbol('my-context');
     *
     * Container.initContext({ context: MyContext, key: myKey });
     * Container.clearContext({ context: MyContext, key: myKey });
     *
     * @example Clear context that was not initialized:
     * class MyContext extends CatContext {}
     *
     * const myKey = Symbol('my-context');
     *
     * Container.initContext({ context: MyContext });
     *
     * Container.clearContext({ context: MyContext, key: myKey }); // <-- Will print "Trying to clear not initialized context, class: MyContext, key: 'Symbol(my-context)'"
     * */
    clearContext<T>(init: ContextProps<T>): void;

    /**
     * Clearing all initialized context.
     *
     * @example Clearing all contexts:
     * class MyContext extends CatContext {}
     *
     * Container.initContext({ context: MyContext });
     *
     * Container.clearAllContexts();
     * */
    clearAllContexts(): void;
}

export const Container: Container = new ContainerImpl();
