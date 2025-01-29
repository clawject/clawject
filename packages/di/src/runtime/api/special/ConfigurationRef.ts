import { Symbols } from '../Symbols';
import { BeanDefinition } from '../bean/BeanDefinition';

export interface ConfigurationRef<T = unknown> {
  readonly [Symbols.ConfigurationReference]: void;

  instance: T;

  //TODO consider wrapper instead of direct access for T for type safety
  resolveByName<T = unknown>(name: string): Promise<T | undefined>;
  resolveByTag<T = unknown>(tag: unknown): Promise<T | undefined>;
  resolve<T>(
    filter: (bean: BeanDefinition<unknown>, cancel: () => void) => boolean
  ): Promise<T | undefined>;

  resolveAllByTag<T = unknown>(tag: unknown): Promise<T[]>;
  resolveAll<T>(
    filter: (bean: BeanDefinition<unknown>, cancel: () => void) => boolean
  ): Promise<T[]>;
}
