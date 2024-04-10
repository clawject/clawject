import { Scope } from '../api/Scope';
import { ObjectFactory, ObjectFactoryResult } from '../api/ObjectFactory';

export class TransientScope implements Scope {
  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    return objectFactory.getObject();
  }

  remove(name: string): ObjectFactoryResult | null {
    return null;
  }

  registerDestructionCallback(name: string, callback: () => void): void {
    // do nothing
  }
  registerScopeBeginCallback(callback: () => void | Promise<void>): void {
    // do nothing
  }
  removeScopeBeginCallback(callback:() => Promise<void>): void {
    // do nothing
  }

  useProxy(): boolean {
    return false;
  }
}
