import { ExposedBeans } from './ExposeBeans';
import { ClassConstructor } from './ClassConstructor';

/**
 * @public
 */
export type PickFieldsWithType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};
/**
 * @public
 */
export type FieldValues<T extends object> = T[keyof T];
/**
 * @public
 */
export type MergedObjects<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
/**
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
 * @public
 */
export interface ClawjectApplicationContext<T extends ClassConstructor<any>> {
  getExposedBean<K extends keyof GetBeansResult<T>>(beanName: K & string): Promise<GetBeansResult<T>[K]>;
  getExposedBeans(): Promise<GetBeansResult<T>>
  close(): Promise<void>;
}
