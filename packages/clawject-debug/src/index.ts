import {ObjectFactory, ObjectFactoryResult, Scope} from '@clawject/di';

class MyScope implements Scope {
  @Scope('singleton')
  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    throw new Error('Method not implemented.');
  }
  remove(name: string): ObjectFactoryResult | null {
    throw new Error('Method not implemented.');
  }
  registerDestructionCallback(name: string, callback: () => void): void {
    throw new Error('Method not implemented.');
  }
  useProxy?(): boolean {
    throw new Error('Method not implemented.');
  }
}
