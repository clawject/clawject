import { ObjectFactory, ObjectFactoryResult } from '../api/ObjectFactory';
import { Scope } from '../api/Scope';
import { Utils } from '../Utils';

export class SingletonScope implements Scope {
  private scopedInstances = new Map<string, ObjectFactoryResult>();

  registerScopeBeginCallback(callback: () => void | Promise<void>): void {
    // do nothing
  }
  removeScopeBeginCallback(callback:() => Promise<void>): void {
    // do nothing
  }

  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    if (this.scopedInstances.has(name)) {
      return this.scopedInstances.get(name)!;
    }

    const object = objectFactory.getObject();

    if (Utils.isPromise(object)) {
      const promiseObject = object.then(resolvedObject => {
        this.scopedInstances.set(name, resolvedObject);
        return resolvedObject;
      });

      this.scopedInstances.set(name, promiseObject);

      return promiseObject;
    }

    this.scopedInstances.set(name, object);

    return object;
  }

  remove(name: string): ObjectFactoryResult | null {
    const object = this.scopedInstances.get(name);

    this.scopedInstances.delete(name);

    return object ?? null;
  }

  registerDestructionCallback(name: string, callback: () => void): void {}

  useProxy(): boolean {
    return false;
  }
}
