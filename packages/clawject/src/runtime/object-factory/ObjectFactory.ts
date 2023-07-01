export type ObjectFactoryResult = string | number | boolean | bigint | Symbol | object;

export interface ObjectFactory {
    getObject(): ObjectFactoryResult;
}
