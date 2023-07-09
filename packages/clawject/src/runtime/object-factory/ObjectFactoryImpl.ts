import { ObjectFactory } from './ObjectFactory';

export class ObjectFactoryImpl implements ObjectFactory {
  constructor(
    private objectBuilder: () => any,
  ) {
  }

  getObject(): any {
    return this.objectBuilder();
  }
}
