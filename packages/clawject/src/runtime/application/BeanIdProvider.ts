import { Value } from '../Value';
import { InternalUtils } from '../InternalUtils';

export class BeanIdProvider {
  private static lastId: Value<number> = InternalUtils.createVersionedStorageOrGetIfExisted('bean_id_storage', 0, new Value(0));

  static getAndInc(): number {
    return this.lastId.value++;
  }
}
