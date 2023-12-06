import { InternalUtils } from './InternalUtils';
import { Value } from './Value';

export class ContextIdStorage {
  private static lastId: Value<number> = InternalUtils.createVersionedStorageOrGetIfExisted('context_id_storage', 0, new Value(0));

  static getAndInc(): number {
    this.lastId.value = this.lastId.value + 1;

    return this.lastId.value;
  }
}
