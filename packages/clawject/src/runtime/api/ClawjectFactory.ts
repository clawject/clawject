import { ClassConstructor } from './ClassConstructor';
import { ClawjectContainer } from '../container/ClawjectContainer';
import { InstantiationConstructorParameters } from './InstantiationConstructorParameters';
import { Utils } from '../Utils';
import { ClawjectApplicationContext } from './ClawjectApplicationContext';
import { ClawjectApplicationContextImpl } from '../ClawjectApplicationContextImpl';

/** @public */
export class ClawjectFactory {
  static async createApplicationContext<C extends ClassConstructor<any, []>>(clawjectApplication: C): Promise<ClawjectApplicationContext<C>>
  static async createApplicationContext<C extends ClassConstructor<any>>(clawjectApplication: C, constructorParameters: InstantiationConstructorParameters<ConstructorParameters<C>>): Promise<ClawjectApplicationContext<C>>
  static async createApplicationContext<C extends ClassConstructor<any>>(clawjectApplication: C, constructorParameters?: any): Promise<ClawjectApplicationContext<C>> {
    const resolvedConstructorParameters = await Utils.getResolvedConstructorParameters(constructorParameters);
    const container = new ClawjectContainer(clawjectApplication, resolvedConstructorParameters);

    await container.init();
    //TODO some hooks with beans here
    await container.postInit();

    return new ClawjectApplicationContextImpl(container);
  }
}
