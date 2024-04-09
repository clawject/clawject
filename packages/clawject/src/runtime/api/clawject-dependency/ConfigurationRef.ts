import { ClassConstructor } from '../ClassConstructor';

/** @public */
export interface ConfigurationRef {
  readonly classConstructor: ClassConstructor<any>;
  readonly instance: object;

  getBean<T>(beanName: string): T | Promise<T>;
  findBean<T>(predicate: (beanName: string, resolvedBeanConstructor: ClassConstructor<any> | null) => boolean): T | Promise<T> | null;
  filterBeans<T>(predicate: (beanName: string, resolvedBeanConstructor: ClassConstructor<any> | null) => boolean): T[] | Promise<T[]>;

  readonly ___clawject_uid___: '1';
}
