import { Utils } from '../Utils';
import { ClawjectContainer } from './ClawjectContainer';

export class ContainerStorage {
  private static storage = Utils.createVersionedStorageOrGetIfExisted('containers', 0, new Set<ClawjectContainer>());

  static registerContainer(container: ClawjectContainer): void {
    this.storage.add(container);
  }

  static getContainers(): ReadonlySet<ClawjectContainer> {
    return this.storage;
  }

  static removeContainer(container: ClawjectContainer): void {
    this.storage.delete(container);
  }
}
