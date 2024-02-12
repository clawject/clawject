import { ClawjectApplicationContext } from './ClawjectApplicationContext';
import { ClassConstructor } from './ClassConstructor';
import { ClawjectContainer } from '../container/ClawjectContainer';

/** @public */
export class ClawjectFactory {
  static async createApplicationContext<T extends ClassConstructor<any>>(clawjectApplication: T): Promise<ClawjectApplicationContext<T>> {
    const container = new ClawjectContainer(clawjectApplication);

    await container.init();
    //TODO some hooks with beans here
    await container.postInit();

    return new ClawjectApplicationContext(container);
  }
}
