import { ClassConstructor } from '../ClassConstructor';
import { Utils } from '../../Utils';
import { InstantiationConstructorParameters } from '../InstantiationConstructorParameters';
import { ImportDefinition } from './ImportDefinition';
import { MaybePromise } from '../../types/MaybePromise';
import { ImportDefinitionImpl } from './ImportDefinitionImpl';

/**
 * *Import* function allows you
 * to import a {@link Configuration @Configuration} class into the target {@link Configuration @Configuration} class
 * to use beans that is provided by imported configuration.
 *
 * @public
 * */
export function Import<C extends ClassConstructor<any, []>>(value: MaybePromise<C>): ImportDefinition<C>;
export function Import<C extends ClassConstructor<any>>(
  value: MaybePromise<C>,
  params: InstantiationConstructorParameters<ConstructorParameters<Awaited<C>>>
): ImportDefinition<C>;
export function Import(clazz: any, params?: any): any {
  return new ImportDefinitionImpl(
    clazz,
    Utils.isFunction(params) ? params : () => (params ?? []),
  );
}
