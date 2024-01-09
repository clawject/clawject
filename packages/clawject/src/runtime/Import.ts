import { ClassConstructor } from './ClassConstructor';

/** @public */
export function Import<T, A extends any[], C extends ClassConstructor<T, A>>(configurationClass: C): ImportedConfiguration<C> {
  return {
    constructor: configurationClass
  };
}

/** @public */
export interface ImportedConfiguration<C extends ClassConstructor<any>> {
  constructor: C;
}
