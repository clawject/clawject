import { ObjectFactory, ObjectFactoryResult } from '../object-factory/ObjectFactory';
import { Callback } from '../types/Callback';

export interface Scope {
    get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult;
    remove(name: string): ObjectFactoryResult | null;
    registerDestructionCallback(name: string, callback: Callback): void;

    //Default = true
    readonly proxyBeans?: boolean;
}
