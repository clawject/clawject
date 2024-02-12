import { ClassConstructor } from './ClassConstructor';
import { RuntimeErrors } from './errors';
import { isPromise } from './application/utils/isPromise';

/** @public */
export const Import: {
  <C extends ClassConstructor<any>>(configurationClass: C): ImportedConfiguration<C>
  <C extends ClassConstructor<any>>(configurationClass: Promise<C>): Promise<ImportedConfiguration<C>>
} = (configurationClass: any): any => {
  if (isPromise(configurationClass)) {
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
};

/** @public */
export interface ImportedConfiguration<C extends ClassConstructor<any>> {
  readonly constructor: C;
  readonly ___clawject_internal_token___: never;
}
