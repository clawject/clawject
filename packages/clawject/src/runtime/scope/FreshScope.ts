import { CustomScope } from '../api/CustomScope';
import { ObjectFactory, ObjectFactoryResult } from '../api/ObjectFactory';
import { Callback } from './Callback';

export class FreshScope implements CustomScope {
  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    return objectFactory.getObject();
  }

  registerDestructionCallback(name: string, callback: Callback): void {
    console.warn(`Destruction callbacks is not supported in 'fresh' scope, beanName: ${name}`);
  }

  remove(name: string): ObjectFactoryResult | null {
    return null;
  }

  useProxy(): boolean {
    return true;
  }
}
