import { ClawjectContainer } from './container/ClawjectContainer';
import { ClassConstructor } from './api/ClassConstructor';
import { ClawjectApplicationContext } from './api/ClawjectApplicationContext';

export class ClawjectApplicationContextImpl<T extends ClassConstructor<any>> implements ClawjectApplicationContext<T> {
  constructor(
    private readonly container: ClawjectContainer,
  ) {}

  getExposedBean(beanName: string): Promise<any> {
    return this.container.getExposedBean(beanName);
  }

  getExposedBeans(): Promise<any> {
    return this.container.getExposedBeans();
  }

  close(): Promise<void> {
    return this.container.close();
  }
}
