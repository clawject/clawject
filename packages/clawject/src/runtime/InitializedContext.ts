/**
 * This object is an access point to all beans in context.
 *
 * @public
 */
export interface InitializedContext<T> {
  /**
   * Returns bean by name if it's declared in T.
   */
  getBean<K extends string & keyof T>(beanName: K): T[K];

  /**
   * Returns all beans in context that is declared in T.
   * */
  getBeans(): T;

  /**
   * Returns all beans in context. If bean was not instantiated - will instantiate it and return.
   * */
  getAllBeans(): Map<string, unknown>;
}
