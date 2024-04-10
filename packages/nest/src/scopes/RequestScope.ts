import { ObjectFactory, ObjectFactoryResult, Scope } from '@clawject/di';

import { AsyncLocalStorage } from 'node:async_hooks';

export class ALS {
  private idSeq = 0;
  private asyncLocalStorage = new AsyncLocalStorage<number>();

  run<T>(callback: () => T): T {
    return this.asyncLocalStorage.run(this.idSeq++, callback);
  }

  getCurrentRequestId(): number | null {
    const id = this.asyncLocalStorage.getStore();

    return id ?? null;
  }
}

export class RequestScope implements Scope {
  constructor(
    private als: ALS
  ) {}

  private beginCallbacks: (() => Promise<void>)[] = [];
  private requestIdToNameToInstance = new Map<number, Map<string, any>>();
  private destructionCallbacks = new Map<number, Map<string, () => void>>();

  async onScopeBegin(): Promise<void> {
    await Promise.all(this.beginCallbacks.map(cb => cb()));
  }

  async onScopeEnded(): Promise<void> {
    const requestId = this.als.getCurrentRequestId();
    if (requestId === null) {
      return;
    }

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
    const requestId = this.als.getCurrentRequestId();
    if (requestId === null) {
      return {};
    }

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
    const requestId = this.als.getCurrentRequestId();
    if (requestId === null) {
      return null;
    }

    const instance = this.requestIdToNameToInstance.get(requestId)?.get(name);

    this.destructionCallbacks.get(requestId)?.delete(name);
    this.requestIdToNameToInstance.get(requestId)?.delete(name);

    return instance ?? null;
  }

  registerDestructionCallback(name: string, callback: () => void): void {
    const requestId = this.als.getCurrentRequestId();
    if (requestId === null) {
      return;
    }

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
