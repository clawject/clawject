import { ObjectFactory, ObjectFactoryResult } from '../object-factory/ObjectFactory';

/**
 * The interface that represents a custom scope.
 * You should implement it if you want to register custom scope.
 *
 * @docs https://clawject.org/docs/advanced-concepts/custom-scopes
 *
 * @public
 */
export interface CustomScope {
  /**
   * Return the object with the given name from the underlying scope,
   * {@link ObjectFactory.getObject creating it}.
   * if not found in the underlying storage mechanism.
   *
   * This is the main operation of a Scope, and the only operation
   * that is absolutely required.
   * @param name - the name of the object to retrieve
   * @param objectFactory - the {@link ObjectFactory} instance to use to create the scoped
   * object if it is not present in the underlying storage mechanism
   * @returns ObjectFactoryResult - the desired object (never: `null` or `undefined`)
   */
  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult;

  /**
   * Remove the object with the given `name` from the underlying scope.
   * <p>Returns `null` if no object was found, otherwise
   * returns the removed {@link ObjectFactoryResult object}.
   * <p>Note that an implementation should also remove a registered destruction
   * callback for the specified object, if any.
   * It does, however, <i>not</i>
   * need to <i>execute</i> a registered destruction callback in this case,
   * since the object will be destroyed by the caller (if appropriate).
   *
   * <b>Note: This is an optional operation.</b>
   *
   * @param name - the name of the object to remove
   * @returns Removed - {@link ObjectFactoryResult object}, or `null` if no object was present
   * @see #registerDestructionCallback
   */
  remove(name: string): ObjectFactoryResult | null;

  /**
   * Register a callback to be executed on destruction of the specified
   * object in the scope (or at destruction of the entire scope, if the
   * scope does not destroy individual objects but rather only terminates
   * in its entirety).
   *
   * <b>Note: This is an optional operation.</b> This method will only
   * be called for scoped beans with actual destruction configuration
   * (methods that are decorated with \@PreDestroy).
   * Implementations should do their best to execute a given callback
   * at the appropriate time.
   * If such a callback is not supported by the
   * underlying runtime environment at all, the callback <i>must be
   * ignored and a corresponding warning should be logged</i>.
   *
   * Note that 'destruction' refers to automatic destruction of
   * the object as part of the scope's own lifecycle, not to the individual
   * scoped object having been explicitly removed by the application.
   * If a scoped object gets removed via this facade's {@link CustomScope#remove remove}
   * method, any registered destruction callback should be removed as well,
   * assuming that the removed object will be reused or manually destroyed.
   *
   * @param name - the name of the object to execute the destruction callback for
   * @param callback - the destruction callback to be executed.
   * @see PreDestroy
   */
  registerDestructionCallback(name: string, callback: () => void): void;

  /**
   * Indicates whether a proxy should be injected or the raw object.
   *
   * In default scopes (singleton, prototype) `false` value is returned from this method,
   * but if you want to implement your own scope (for example - http-request scope),
   * most likely you will need to return `true` from this method.
   *
   * Be careful with primitive values, because they are not supported by JavaScript Proxies (at least for now).
   *
   * @returns boolean `true` if a proxy should be injected, `false` otherwise.
   */
  useProxy?(): boolean;
}
