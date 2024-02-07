import { ClassConstructor } from './ClassConstructor';

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

  return {
    constructor: configurationClass
  };
}

/** @public */
export interface ImportedConfiguration<C extends ClassConstructor<any>> {
  constructor: C;
}
