import { ObjectFactory, ObjectFactoryResult } from '../object-factory/ObjectFactory';
import { Callback } from '../types/Callback';

//TODO maybe rename just to scope when will not compile to single file
export interface CustomScope {
    get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult;
    remove(name: string): ObjectFactoryResult | null;
    registerDestructionCallback(name: string, callback: Callback): void;

    //Default = true
    readonly proxyBeans?: boolean;
}
