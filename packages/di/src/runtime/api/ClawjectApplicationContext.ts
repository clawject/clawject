import { ExposedBeans } from './ExposeBeans';
import { ClassConstructor } from './ClassConstructor';
import { FieldValues, MergedObjects, PickFieldsWithType } from './UtilityTypes';

/**
 * @internalApi Object that is produced by {@link ClawjectApplicationContext#getExposedBeans} function.
 *
 * @public
 */
export type GetBeansResult<T extends ClassConstructor<any>> = MergedObjects<
  ReturnType<FieldValues<
    PickFieldsWithType<
      InstanceType<T>,
      (arg: ExposedBeans<any>) => ExposedBeans<any>
    >
  >>['beans'] | {}
>;

/**
 * It is an object that stores and manages configurations and beans of the application.
 *
 * @docs https://clawject.com/docs/fundamentals/clawject-application-context
 *
 * @public
 */
export interface ClawjectApplicationContext<T extends ClassConstructor<any>> {
  /**
   * Returns the exposed bean instance by the given name.
   * */
  getExposedBean<K extends keyof GetBeansResult<T>>(beanName: K & string): Promise<GetBeansResult<T>[K]>;
  /**
   * Returns all exposed beans.
   * */
  getExposedBeans(): Promise<GetBeansResult<T>>

  /**
   * Closes the application context and destroys all beans.
   * Functions annotated with `@PreDestroy` will be called for all beans.
   * */
  destroy(): Promise<void>;
}
