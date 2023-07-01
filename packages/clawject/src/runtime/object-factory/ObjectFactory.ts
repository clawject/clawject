export type ObjectFactoryResult = string | number | boolean | bigint | object;

export interface ObjectFactory {
    getObject(): ObjectFactoryResult;
}
