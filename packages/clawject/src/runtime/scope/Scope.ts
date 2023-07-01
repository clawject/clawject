import { ObjectFactory, ObjectFactoryResult } from '../object-factory/ObjectFactory';
import { Callback } from '../Callback';

export interface Scope {
    get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult;
    remove(name: string): ObjectFactoryResult | null;
    registerDestructionCallback(name: string, callback: Callback): void;
    getConversationId(): string | null;

    //Default = true
    readonly proxyBeans?: boolean;
}
