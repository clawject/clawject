import { BeanDefinition } from './api/bean/BeanDefinition';
import { ApplicationRef } from './api/special/ApplicationRef';
import { ConfigurationRef } from './api/special/ConfigurationRef';
import { Symbols } from './api/Symbols';

export class ApplicationRefImpl implements ApplicationRef {
  get [Symbols.ApplicationReference](): void {
    return;
  }

  resolve<T>(filter: ((configurationRef: ConfigurationRef, bean: BeanDefinition<unknown>, cancel: () => void) => boolean)): Promise<T | undefined> {
    throw new Error('Method not implemented.');
  }

  resolveAll<T>(filter: (configurationRef: ConfigurationRef, bean: BeanDefinition<unknown>, cancel: () => void) => boolean): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
}
