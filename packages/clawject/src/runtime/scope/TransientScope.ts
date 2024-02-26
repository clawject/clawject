import { Scope } from '../api/Scope';
import { ObjectFactory, ObjectFactoryResult } from '../api/ObjectFactory';

export class TransientScope implements Scope {
  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    return objectFactory.getObject();
  }

  remove(name: string): ObjectFactoryResult | null {
    return null;
  }

  registerDestructionCallback(name: string, callback: () => void): void {}
  registerScopeBeginCallback(callback: () => void | Promise<void>): void {}
  removeScopeBeginCallback(callback:() => Promise<void>): void {}

  useProxy(): boolean {
    return false;
  }
}
