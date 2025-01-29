import { BeanDefinition } from './api/bean/BeanDefinition';
import { ConfigurationRef } from './api/special/ConfigurationRef';
import { Symbols } from './api/Symbols';

export class ConfigurationRefImpl implements ConfigurationRef {
  get [Symbols.ConfigurationReference](): void {
    return;
  }

  constructor(
    public readonly instance: unknown
  ) {}

  resolveByName<T = unknown>(name: string): Promise<T | undefined> {
    throw new Error('Method not implemented.');
  }

  resolveByTag<T = unknown>(tag: unknown): Promise<T | undefined> {
    throw new Error('Method not implemented.');
  }
  resolve<T>(
    filter: (bean: BeanDefinition<unknown>, cancel: () => void) => boolean
  ): Promise<T | undefined> {
    throw new Error('Method not implemented.');
  }

  resolveAllByTag<T = unknown>(tag: unknown): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  resolveAll<T>(
    filter: (bean: BeanDefinition<unknown>, cancel: () => void) => boolean
  ): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
}
