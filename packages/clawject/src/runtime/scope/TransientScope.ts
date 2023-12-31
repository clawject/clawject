import { CustomScope } from './CustomScope';
import { ObjectFactory, ObjectFactoryResult } from '../object-factory/ObjectFactory';
import { Callback } from '../types/Callback';

export class TransientScope implements CustomScope {
  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    return objectFactory.getObject();
  }

  registerDestructionCallback(name: string, callback: Callback): void {
    //TODO
    console.warn(`Destruction callbacks are is supported in 'transient' scope, beanName: ${name}`);
  }

  remove(name: string): ObjectFactoryResult | null {
    return null;
  }

  useProxy(): boolean {
    return false;
  }
}
