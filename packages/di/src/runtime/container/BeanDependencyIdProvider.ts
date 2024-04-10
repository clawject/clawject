import { Value } from '../types/Value';
import { Utils } from '../Utils';

export class BeanDependencyIdProvider {
  private static lastId: Value<number> = Utils.createVersionedStorageOrGetIfExisted('bean_dependency_id_storage', 0, new Value(0));

  static getAndInc(): number {
    return this.lastId.value++;
  }
}
