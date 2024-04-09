import { ImportedConfiguration } from './Import';
import { BeanConstructorFactory } from './decorators/index';
import { ApplicationContext } from './clawject-dependency/ApplicationContext';
import { ConfigurationRef } from './clawject-dependency/ConfigurationRef';

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
  ImportedConfiguration: ImportedConfiguration<any, any>;
  BeanConstructorFactory: BeanConstructorFactory<any, any>;
  ApplicationContext: ApplicationContext;
  ConfigurationRef: ConfigurationRef;
}
