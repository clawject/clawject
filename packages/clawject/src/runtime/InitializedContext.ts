/**
 * This object is an access point to all beans in context.
 *
 * @docs https://clawject.org/docs/base-concepts/initialized-context
 *
 * @public
 */
export interface InitializedContext<T> {
  /**
   * Returns bean by name if it's declared in T.
   *
   * @throws BeanNotFoundError - If bean is not found.
   *
   * @docs https://clawject.org/docs/base-concepts/initialized-context/#initializedcontextgetbean
   */
  getBean<K extends string & keyof T>(beanName: K): T[K];

  /**
   * Returns all beans in context that is declared in T.
   *
   * @docs https://clawject.org/base-concepts/initialized-context/#initializedcontextgetbeans
   * */
  getBeans(): T;

  /**
   * Returns all beans in context. If bean was not instantiated - will instantiate it and return.
   *
   * @docs https://clawject.org/base-concepts/initialized-context/#initializedcontextgetallbeans
   * */
  getAllBeans(): Map<string, unknown>;
}
