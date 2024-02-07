import { ClassConstructor } from './ClassConstructor';

/** @public */
export function Import<C extends ClassConstructor<any>>(configurationClass: C): ImportedConfiguration<C> {
  return {
    constructor: configurationClass
  };
}

/** @public */
export interface ImportedConfiguration<C extends ClassConstructor<any>> {
  constructor: C;
}
