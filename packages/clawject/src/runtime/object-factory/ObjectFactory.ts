/** @public */
export type ObjectFactoryResult = string | number | boolean | bigint | Symbol | object;

/** @public */
export interface ObjectFactory {
  getObject(): ObjectFactoryResult;
}
