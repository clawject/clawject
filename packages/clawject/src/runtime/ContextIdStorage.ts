import { ClawjectObjectStorage } from '@clawject/object-storage';

export class ContextIdStorage {
  private static STORAGE_KEY = 'context_id_storage';
  private static VERSION = 0;
  private static versionedIds: Map<number, number>;

  static {
    this.versionedIds = ClawjectObjectStorage.getOrSetIfNotPresent(this.STORAGE_KEY, new Map<number, number>());
  }

  static getAndInc(): number {
    const latestId = this.versionedIds.get(this.VERSION) ?? Number.MIN_SAFE_INTEGER;
    this.versionedIds.set(this.VERSION, latestId + 1);

    return latestId;
  }
}
