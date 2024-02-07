import { ClawjectApplicationContext } from './ClawjectApplicationContext';
import { ClassConstructor } from '../ClassConstructor';
import { ClawjectContainer } from './ClawjectContainer';

export class ClawjectFactory {
  static async createApplicationContext(clawjectApplication: ClassConstructor<any>): Promise<ClawjectApplicationContext> {
    const container = new ClawjectContainer(clawjectApplication);

    await container.init();
    //TODO some hooks with beans here
    await container.postInit();

    return new ClawjectApplicationContext(container);
  }
}
