import { ClassConstructor } from '../ClassConstructor';

/** @public */
export interface ApplicationContext {
  getBean<T>(beanName: string): T | Promise<T>;
  getBeans<T>(beanName: string): T[] | Promise<T[]>;
  findBean<T>(predicate: (beanName: string, resolvedBeanConstructor: ClassConstructor<any> | null, configurationParent: ClassConstructor<any>) => boolean): T;
  filterBeans<T>(predicate: (beanName: string, resolvedBeanConstructor: ClassConstructor<any> | null, configurationParent: ClassConstructor<any>) => boolean): T[];

  readonly ___clawject_uid___: '0';
}
