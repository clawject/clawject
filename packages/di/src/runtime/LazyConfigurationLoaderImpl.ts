import { ConfigurationRef } from './api/special/ConfigurationRef';
import { LazyConfigurationLoader } from './api/special/LazyConfigurationLoader';
import { Symbols } from './api/Symbols';

export class LazyConfigurationLoaderImpl implements LazyConfigurationLoader<any> {
  constructor(
    private readonly getConfigurationRef: () => Promise<ConfigurationRef<any>>
  ) {}

  get [Symbols.LazyConfigurationLoader](): void {
    return;
  }

  load(): Promise<ConfigurationRef<any>> {
    return this.getConfigurationRef();
  }
}
