/** @public */
export type ObjectFactoryResult = string | number | boolean | bigint | symbol | object;

/**
 * Defines a factory which can return an Object instance when invoked.
 *
 * @see Scope
 *
 * @public
 */
export interface ObjectFactory {
  getObject(): ObjectFactoryResult | Promise<ObjectFactoryResult>;
}
