import { Symbols } from '../Symbols';
import { ConfigurationRef } from './ConfigurationRef';

export interface LazyConfigurationLoader<T> {
  readonly [Symbols.LazyConfigurationLoader]: void;

  load(): Promise<ConfigurationRef<T>>;
}
