import { Scope } from './Scope';
import { ObjectFactory, ObjectFactoryResult } from '../object-factory/ObjectFactory';
import { Callback } from '../Callback';

export class SingletonScope implements Scope {
    private instances = new Map<string, ObjectFactoryResult>();
    private destructionCallbacks = new Map<string, Callback>();

    get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
        const instance = this.instances.get(name) ?? objectFactory.getObject();
        this.instances.set(name, instance);

        return instance;
    }

    registerDestructionCallback(name: string, callback: Callback): void {
        this.destructionCallbacks.set(name, callback);
    }

    remove(name: string): ObjectFactoryResult | null {
        const instance = this.instances.get(name) ?? null;

        this.destructionCallbacks.get(name)?.();
        this.instances.delete(name);
        this.destructionCallbacks.delete(name);

        return instance;
    }

    getConversationId(): string | null {
        return null;
    }

    get proxyBeans(): boolean {
        return false;
    }
}
