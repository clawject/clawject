import { ClassConstructor } from './ClassConstructor';
import { RuntimeErrors } from './errors';

/** @public */
export function Import<C extends ClassConstructor<any>>(configurationClass: C): ImportedConfiguration<C>
export function Import<C extends ClassConstructor<any>>(configurationClass: Promise<C>): Promise<ImportedConfiguration<C>>
export function Import<C extends ClassConstructor<any>>(configurationClass: C | Promise<C>): ImportedConfiguration<C> | Promise<ImportedConfiguration<C>> {
  if (configurationClass instanceof Promise) {
    return configurationClass.then((resolvedConfigurationClass) => {
      return {
        constructor: resolvedConfigurationClass
      };
    });
  }

  if (typeof configurationClass === 'function') {
    return {
      constructor: configurationClass
    };
  }

  throw new RuntimeErrors.IllegalArgumentError('Argument must be a class constructor or a promise of a class constructor');
}

/** @public */
export interface ImportedConfiguration<C extends ClassConstructor<any>> {
  constructor: C;
}
