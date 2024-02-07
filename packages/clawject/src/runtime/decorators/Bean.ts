import { ClassConstructor } from '../ClassConstructor';
import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type BeanTarget = PropertyDecorator & MethodDecorator;
/** @public */
export type BeanWithConstructor = <C extends ClassConstructor<any>>(classConstructor: C) => BeanConstructorFactory<InstanceType<C>, C>;
export type BeanWithConstructorExplicitType = <T, C extends ClassConstructor<T>>(classConstructor: C) => BeanConstructorFactory<T, C>;
/**
 * @public
 * */
export interface BeanConstructorFactory<T, C extends ClassConstructor<T>> {
  constructor: C;
  factory: (...args: ConstructorParameters<C>) => T;
}
/**
 * Indicates that a method/property produces/contains a bean to be managed by the Clawject container.
 *
 * @docs https://clawject.org/docs/base-concepts/bean
 *
 * @public
 */
export const Bean: DecoratorWithoutArguments<BeanTarget> & BeanWithConstructor & BeanWithConstructorExplicitType = (...args: any[]): any => {
  if (args.length === 1 && typeof args[0] === 'function') {
    return {
      constructor: args[0],
      factory: (...constructorArgs: any[]) => new args[0](...constructorArgs)
    };
  }

  throw ErrorBuilder.usageWithoutConfiguredDI('@Bean');
};
