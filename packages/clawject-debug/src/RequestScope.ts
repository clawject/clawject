import {ObjectFactory, ObjectFactoryResult, Scope} from '@clawject/di';

import {HttpExecutionContext} from './HTTPExecutionContext';

export class RequestScope implements Scope {
  private constructor() {}
  static readonly instance = new RequestScope();

  private beginCallbacks: (() => Promise<void>)[] = [];
  private requestIdToNameToInstance = new Map<number, Map<string, any>>();
  private destructionCallbacks = new Map<number, Map<string, () => void>>();

  async onScopeBegin(): Promise<void> {
    await Promise.all(this.beginCallbacks.map(cb => cb()));
  }

  async onScopeEnded(): Promise<void> {
    const requestId = HttpExecutionContext.getCurrentRequestId();
    const destructionCallbacks = Array.from(this.destructionCallbacks.get(requestId)?.values() ?? []);

    await Promise.all(destructionCallbacks.map(cb => cb()));

    this.requestIdToNameToInstance.delete(requestId);
    this.destructionCallbacks.delete(requestId);
  }

  registerScopeBeginCallback(callback: () => Promise<void>): void {
    this.beginCallbacks.push(callback);
  }

  removeScopeBeginCallback(callback: () => Promise<void>): void {
    this.beginCallbacks = this.beginCallbacks.filter(cb => cb !== callback);
  }

  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    const requestId = HttpExecutionContext.getCurrentRequestId();
    let nameToInstance = this.requestIdToNameToInstance.get(requestId);
    if (!nameToInstance) {
      nameToInstance = new Map();
      this.requestIdToNameToInstance.set(requestId, nameToInstance);
    }

    let object: any;

    if (nameToInstance.has(name)) {
      object = nameToInstance.get(name);
    } else {
      object = objectFactory.getObject();
      if (object instanceof Promise) {
        object = object.then(resolvedObject => {
          nameToInstance!.set(name, resolvedObject);
          return resolvedObject;
        });
      }
      nameToInstance.set(name, object);
    }

    return object;
  }

  remove(name: string): ObjectFactoryResult | null {
    const requestId = HttpExecutionContext.getCurrentRequestId();

    const instance = this.requestIdToNameToInstance.get(requestId)?.get(name);

    this.destructionCallbacks.get(requestId)?.delete(name);
    this.requestIdToNameToInstance.get(requestId)?.delete(name);

    return instance ?? null;
  }

  registerDestructionCallback(name: string, callback: () => void): void {
    const requestId = HttpExecutionContext.getCurrentRequestId();
    let nameToCallback = this.destructionCallbacks.get(requestId);
    if (!nameToCallback) {
      nameToCallback = new Map();
      this.destructionCallbacks.set(requestId, nameToCallback);
    }

    nameToCallback.set(name, callback);
  }

  useProxy(): boolean {
    return true;
  }
}
