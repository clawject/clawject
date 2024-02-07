import { CustomScope } from './CustomScope';
import { ObjectFactory, ObjectFactoryResult } from '../object-factory/ObjectFactory';
import { Callback } from '../types/Callback';

export class SingletonScope implements CustomScope {
  private scopedObjects = new Map<string, ObjectFactoryResult>();
  private destructionCallbacks = new Map<string, Callback>();

  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    const instance = this.scopedObjects.get(name) ?? objectFactory.getObject();
    this.scopedObjects.set(name, instance);

    return instance;
  }

  registerDestructionCallback(name: string, callback: Callback): void {
    this.destructionCallbacks.set(name, callback);
  }

  remove(name: string): ObjectFactoryResult | null {
    const instance = this.scopedObjects.get(name) ?? null;

    this.scopedObjects.delete(name);
    this.destructionCallbacks.delete(name);

    return instance;
  }

  useProxy(): boolean {
    return false;
  }
}
