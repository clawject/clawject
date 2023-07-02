import { InitializedContext } from './InitializedContext';
import { CatContext } from './CatContext';
import { ContainerManagerImpl } from './ContainerManagerImpl';
import { ClassConstructor } from './ClassConstructor';
import { CustomScope } from './scope/CustomScope';

export interface ContextInit {
    key?: any;
}

export interface ContextInitConfig<C = never> {
    config: C;
}

// TODO update comments
/**
 * Container is a main entry point to work with DI.
 *
 * You can use Container to initialize, get or clear contexts.
 *
 * You can use this object anywhere in your code.
 * */
export interface ContainerManager {
    /**
     * Initializing CatContext and returns {@link InitializedContext} object.
     *
     * If context was already initialized but not cleared - new context will be instantiated and put in cache instead of old one.
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
    init<T>(context: ClassConstructor<CatContext<T>>, init?: ContextInit): InitializedContext<T>;
    init<T, C>(context: ClassConstructor<CatContext<T, C>>, init: ContextInit & ContextInitConfig<C>): InitializedContext<T>;

    /**
     * Returning {@link InitializedContext Context} object if it was initialized, if not - throws error with context name and key from {@link ContextProps}.
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
    get<T>(context: ClassConstructor<CatContext<T>>, key?: any): InitializedContext<T>;

    /**
     * Returning already initialized {@link InitializedContext Context} object if it was initialized, if not - builds new context object.
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
    getOrInit<T>(context: ClassConstructor<CatContext<T>>, init?: ContextInit): InitializedContext<T>;

    getOrInit<T, C>(context: ClassConstructor<CatContext<T, C>>, init: ContextInit & ContextInitConfig<C>): InitializedContext<T>;

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
    clear(context: ClassConstructor<CatContext<any>>, key?: any): void;

    registerScope(scopeName: string, scope: CustomScope): void;
}

export const ContainerManager: ContainerManager = new ContainerManagerImpl();
