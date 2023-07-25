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

/**
 * `ContainerManager` serves as the main entry point for working with Dependency Injection (DI).
 *
 * You can utilize `ContainerManager` to initialize, get, or clear contexts.
 *
 * This object can be used anywhere in your code.
 */
export interface ContainerManager {
  /**
   * Initializes `CatContext` and returns an {@link InitializedContext} object.
   *
   * If the context was already initialized but not cleared, a new context will be instantiated and cached in place of the old one.
   * Not clearing the context may lead to memory leaks.
   *
   * @param context - The context class constructor that should be initialized.
   * @param init - Optional initialization object.
   * @returns The initialized context.
   */
  init<T extends object>(context: ClassConstructor<CatContext<T>>, init?: ContextInit): InitializedContext<T>;

  /**
   * Returns an {@link InitializedContext} object if it was initialized,
   * otherwise throws an error with the context name and key.
   *
   * @param context - The context class constructor that should be retrieved.
   * @param key - Optional key for getting a specific context.
   * @returns The initialized context.
   * @throws {Error} If the context was not initialized.
   */
  get<T extends object>(context: ClassConstructor<CatContext<T>>, key?: any): InitializedContext<T>;

  /**
   * Returns an already initialized {@link InitializedContext} object if it was initialized,
   * otherwise builds a new context object.
   *
   * @param context - The context class constructor that should be retrieved or initialized.
   * @param init - Optional initialization object.
   * @returns The initialized context.
   */
  getOrInit<T extends object>(context: ClassConstructor<CatContext<T>>, init?: ContextInit): InitializedContext<T>;

  /**
   * Clears an initialized context. If the initialized context was not found, logs a warning to the console.
   *
   * @param context - The context class constructor that should be cleared.
   * @param key - Optional key for clearing a specific context.
   */
  clear(context: ClassConstructor<CatContext<any>>, key?: any): void;

  /**
   * Registers a custom scope.
   *
   * @param scopeName - The name of the scope that should be registered.
   * @param scope - The custom scope object.
   */
  registerScope(scopeName: string, scope: CustomScope): void;
}

export const ContainerManager: ContainerManager = new ContainerManagerImpl();
