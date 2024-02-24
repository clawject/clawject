import { ClassConstructor } from './ClassConstructor';
import { ClawjectContainer } from '../container/ClawjectContainer';
import { InstantiationConstructorParameters } from './InstantiationConstructorParameters';
import { Utils } from '../Utils';
import { ClawjectApplicationContext } from './ClawjectApplicationContext';
import { ClawjectApplicationContextImpl } from '../ClawjectApplicationContextImpl';
import { ContainerStorage } from '../container/ContainerStorage';

/**
 * It's a factory class that creates a {@link ClawjectApplicationContext} instance.
 *
 * @docs https://clawject.com/docs/fundamentals/clawject-factory
 *
 * @public
 * */
export class ClawjectFactory {
  /**
   * Creates a {@link ClawjectApplicationContext} instance.
   *
   * @param clawjectApplication - The class that is annotated with {@link ClawjectApplication @ClawjectApplication}.
   *
   * @public
   * */
  static async createApplicationContext<C extends ClassConstructor<any, []>>(clawjectApplication: C): Promise<ClawjectApplicationContext<C>>
  /**
   * Creates a {@link ClawjectApplicationContext} instance.
   *
   * @param clawjectApplication - The class that is annotated with {@link ClawjectApplication @ClawjectApplication}.
   * @param constructorParameters - The constructor parameters of the `clawjectApplication` class.
   *
   * @public
   * */
  static async createApplicationContext<C extends ClassConstructor<any>>(clawjectApplication: C, constructorParameters: InstantiationConstructorParameters<ConstructorParameters<C>>): Promise<ClawjectApplicationContext<C>>
  static async createApplicationContext<C extends ClassConstructor<any>>(clawjectApplication: C, constructorParameters?: any): Promise<ClawjectApplicationContext<C>> {
    const resolvedConstructorParameters = await Utils.getResolvedConstructorParameters(constructorParameters);
    const container = new ClawjectContainer(clawjectApplication, resolvedConstructorParameters);

    await container.init();
    //TODO some hooks with beans here
    await container.postInit();

    ContainerStorage.registerContainer(container);

    return new ClawjectApplicationContextImpl(container);
  }
}
