import { ClawjectContainer } from '../container/ClawjectContainer';
import { ClassConstructor } from './ClassConstructor';
import { ExportedBeans } from './ExportBeans';

type PickFieldsWithType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};
type FieldValues<T extends object> = T[keyof T];
type MergedObjects<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type GetBeansResult<T extends ClassConstructor<any>> = MergedObjects<
  ReturnType<FieldValues<
    PickFieldsWithType<
      InstanceType<T>,
      (arg: ExportedBeans<any>) => ExportedBeans<any>
    >
  >>['beans'] | {}
>;

export class ClawjectApplicationContext<T extends ClassConstructor<any>> {
  constructor(
    private readonly container: ClawjectContainer,
  ) {}

  getExportedBean<K extends keyof GetBeansResult<T>>(beanName: K & string): Promise<GetBeansResult<T>[K]> {
    return this.container.getExportedBean(beanName);
  }

  getExportedBeans(): Promise<GetBeansResult<T>> {
    return this.container.getExportedBeans() as Promise<GetBeansResult<T>>;
  }

  destroy(): Promise<void> {
    return this.container.destroy();
  }
}
