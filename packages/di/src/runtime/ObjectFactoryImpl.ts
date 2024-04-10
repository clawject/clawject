import { ObjectFactory } from './api/ObjectFactory';

export class ObjectFactoryImpl implements ObjectFactory {
  constructor(
    private objectBuilder: () => any,
  ) {}

  getObject(): any {
    return this.objectBuilder();
  }
}
