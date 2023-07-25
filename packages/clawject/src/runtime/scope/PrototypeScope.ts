import { CustomScope } from './CustomScope';
import { ObjectFactory, ObjectFactoryResult } from '../object-factory/ObjectFactory';
import { Callback } from '../types/Callback';

export class PrototypeScope implements CustomScope {
  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    return objectFactory.getObject();
  }

  registerDestructionCallback(name: string, callback: Callback): void {
    console.warn(`Destruction callbacks are not supported in 'prototype' scope, beanName: ${name}`);
  }

  remove(name: string): ObjectFactoryResult | null {
    return null;
  }
}
