import { Scope } from './Scope';
import { ObjectFactory, ObjectFactoryResult } from '../object-factory/ObjectFactory';
import { Callback } from '../Callback';

export class PrototypeScope implements Scope {
    get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
        return objectFactory.getObject();
    }

    getConversationId(): string | null {
        return null;
    }

    registerDestructionCallback(name: string, callback: Callback): void {
        console.warn('Destruction callbacks are not supported in "prototype" scope, beanName: ' + name);
    }

    remove(name: string): ObjectFactoryResult | null {
        return null;
    }

    get proxyBeans(): boolean {
        return false;
    }
}
