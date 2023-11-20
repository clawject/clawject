import { InitializedContext } from './InitializedContext';
import { CatContext } from './CatContext';
import { ContainerManagerImpl } from './ContainerManagerImpl';
import { ClassConstructor } from './ClassConstructor';

/** @public */
export interface ContextInit {
  /**
   * Default value is `undefined`.
   */
  key?: any;
}

/** @public */
export interface ContextInitConfig<C = never> {
  config: C;
}

/**
 * `ContainerManager` serves as the main entry point for working with Dependency Injection (DI).
 *
 * You can utilize `ContainerManager` to initialize, acquire or clear contexts.
 *
 * @public
 */
export interface ContainerManager {
  /**
   * Initializes inheritor of {@link CatContext} class and returns {@link InitializedContext} object.
   *
   * If the context was already initialized but not cleared, a new context will be instantiated and cached in place of the old one.
   * Note that not clearing contexts may lead to memory leaks.
   *
   * @param context - The context class constructor that should be initialized.
   * @param init - Optional initialization object.
   * @returns InitializedContext The initialized context.
   *
   * @docs https://clawject.org/docs/base-concepts/container-manager/#containermanagerinit
   */
  init<T extends object>(context: ClassConstructor<CatContext<T>, []>, init?: ContextInit): InitializedContext<T>;
  init<T extends object, C>(context: ClassConstructor<CatContext<T, C>, []>, init: ContextInit & ContextInitConfig<C>): InitializedContext<T>;

  /**
   * Returns an {@link InitializedContext} object if it was initialized,
   * otherwise throws an error with the context name and key.
   *
   * @param context - The context class constructor that should be retrieved.
   * @param key - Optional key for getting a specific context.
   * @returns The initialized context.
   * @throws RuntimeErrors.NoInitializedContextFoundError If the context was not initialized.
   */
  get<T extends object>(context: ClassConstructor<CatContext<T>, []>, key?: any): InitializedContext<T>;

  /**
   * Returns an already initialized {@link InitializedContext} object if it was initialized,
   * otherwise builds a new context object.
   *
   * @param context - The context class constructor that should be retrieved or initialized.
   * @param init - Optional initialization object.
   * @returns InitializedContext.
   */
  getOrInit<T extends object>(context: ClassConstructor<CatContext<T>, []>, init?: ContextInit): InitializedContext<T>;
  getOrInit<T extends object, C>(context: ClassConstructor<CatContext<T, C>, []>, init: ContextInit & ContextInitConfig<C>): InitializedContext<T>;

  /**
   * Destroys an initialized context.
   * If the initialized context was not found, logs warning to the console.
   *
   * @param context - The context class constructor that should be cleared.
   * @param key - Optional key for clearing a specific context.
   */
  destroy(context: ClassConstructor<CatContext<any>>, key?: any): void;
}

/**
 * Singleton instance of {@link ContainerManager} interface that can be used anywhere in your code.
 *
 * @public
 */
export const ContainerManager: ContainerManager = new ContainerManagerImpl();
