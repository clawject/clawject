import { ClassConstructor } from './ClassConstructor';
import { RuntimeErrors } from './RuntimeErrors';
import { Utils } from '../Utils';
import { InstantiationConstructorParameters } from './InstantiationConstructorParameters';

/**
 * *Import* function allows you
 * to import a {@link Configuration @Configuration} class into the target {@link Configuration @Configuration} class
 * to use beans that is provided by imported configuration.
 *
 * @public
 * */
export const Import: {
  <C extends ClassConstructor<any, []>>(configurationClass: C): ImportedConfiguration<C>
  <C extends ClassConstructor<any>>(configurationClass: C, constructorParameters: InstantiationConstructorParameters<ConstructorParameters<C>>): ImportedConfiguration<C>

  <C extends ClassConstructor<any, []>>(configurationClass: Promise<C>): Promise<ImportedConfiguration<C>>
  <C extends ClassConstructor<any>>(configurationClass: Promise<C>, constructorParameters: InstantiationConstructorParameters<ConstructorParameters<C>>): Promise<ImportedConfiguration<C>>
} = (configurationClass: any, constructorParameters?: any): any => {
  if (Utils.isPromise(configurationClass)) {
    return configurationClass.then((resolvedConfigurationClass) => {
      return {
        constructor: resolvedConfigurationClass,
        constructorParameters: constructorParameters ?? [],
      };
    });
  }

  if (typeof configurationClass === 'function') {
    return {
      constructor: configurationClass,
      constructorParameters: constructorParameters ?? [],
    };
  }

  throw new RuntimeErrors.IllegalArgumentError('Argument must be a class constructor or a promise of a class constructor');
};

/**
 * @internalApi Object that is produced by {@link Import} function.
 *
 * @public
 */
export interface ImportedConfiguration<C extends ClassConstructor<any>, A extends any[] = ConstructorParameters<C>> {
  readonly constructor: C;
  readonly constructorParameters: A | (() => A | Promise<A>);
  readonly ___clawject_internal_token___: never;
}
