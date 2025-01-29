import { Symbols } from '../Symbols';
import { BeanDefinition } from '../bean/BeanDefinition';
import { ConfigurationRef } from './ConfigurationRef';

export interface ApplicationRef {
  readonly [Symbols.ApplicationReference]: void;

  resolve<T>(
    filter: (
      configurationRef: ConfigurationRef,
      bean: BeanDefinition<unknown>,
      cancel: () => void
    ) => boolean
  ): Promise<T | undefined>;

  resolveAll<T>(
    filter: (
      configurationRef: ConfigurationRef,
      bean: BeanDefinition<unknown>,
      cancel: () => void
    ) => boolean
  ): Promise<T[]>;
}
