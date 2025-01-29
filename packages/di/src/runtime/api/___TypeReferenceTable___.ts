import { BeanConstructorFactory, ClawjectDecorator } from './decorators';
import { ImportDefinition } from './import/ImportDefinition';
import { BeanDefinition } from './bean/BeanDefinition';
import { ConfigurationDefinition } from './configuration/ConfigurationDefinition';
import { ApplicationDefinition } from './application/ApplicationDefinition';
import { ExposeDefinition } from './expose/ExposeDefinition';
import { LifecycleDefinition } from './lifecycle/LifecycleDefinition';
import { ApplicationRef } from './special/ApplicationRef';
import { ConfigurationRef } from './special/ConfigurationRef';
import { Lazy } from './special/Lazy';
import { LazyConfigurationLoader } from './special/LazyConfigurationLoader';

/**
 * @internalApi It's a part of API used by clawject internally,
 * do not rely on it in your code because it **may and will be changed** without notice.
 *
 * @public
 */
export interface ___TypeReferenceTable___ {
  Array: ReadonlyArray<any> | Array<any> | readonly any[] | any[];
  Set: ReadonlySet<any> | Set<any>;
  Map: ReadonlyMap<any, any> | Map<any, any>;
  MapStringToAny: ReadonlyMap<string, any> | Map<string, any>;
  Promise: Promise<any> | PromiseLike<any>;

  BeanConstructorFactory: BeanConstructorFactory<any, any>;
  ClawjectDecorator: ClawjectDecorator<any>;

  ApplicationDefinition: ApplicationDefinition<any, any, any>;
  ConfigurationDefinition: ConfigurationDefinition<any, any, any>;
  BeanDefinition: BeanDefinition<any, any, any, any, any, any, any, any>;
  LifecycleDefinition: LifecycleDefinition<any, any>;
  ImportDefinition: ImportDefinition<any, any>;
  ExposeDefinition: ExposeDefinition<any>;

  ApplicationRef: ApplicationRef;
  ConfigurationRef: ConfigurationRef<any>;
  Lazy: Lazy<any>;
  LazyConfigurationLoader: LazyConfigurationLoader<any>;
}
