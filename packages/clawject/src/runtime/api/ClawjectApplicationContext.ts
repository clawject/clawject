import { ExposedBeans } from './ExposeBeans';
import { ClassConstructor } from './ClassConstructor';

/**
 * @public
 */
export type PickFieldsWithType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};
/**
 * @internalApi Just a utility type.
 *
 * @public
 */
export type FieldValues<T extends object> = T[keyof T];
/**
 * @internalApi Just a utility type.
 * @public
 */
export type MergedObjects<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
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
  close(): Promise<void>;
}
