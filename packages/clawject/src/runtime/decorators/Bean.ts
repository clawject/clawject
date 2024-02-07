import { ClassConstructor } from '../ClassConstructor';
import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type BeanTarget = PropertyDecorator & MethodDecorator;
/** @public */
export type BeanWithConstructor = <C extends ClassConstructor<any>>(classConstructor: C) => BeanConstructorFactory<InstanceType<C>, C>;
export type BeanWithConstructorAsync = <C extends ClassConstructor<any>>(classConstructor: Promise<C> | PromiseLike<C>) => Promise<BeanConstructorFactory<InstanceType<C>, C>>;
export type BeanWithConstructorExplicitType = <T, C extends ClassConstructor<T>>(classConstructor: C) => BeanConstructorFactory<T, C>;
export type BeanWithConstructorExplicitTypeAsync = <T, C extends ClassConstructor<T>>(classConstructor: Promise<C> | PromiseLike<C>) => Promise<BeanConstructorFactory<T, C>>;
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
export const Bean: DecoratorWithoutArguments<BeanTarget> & BeanWithConstructor & BeanWithConstructorAsync & BeanWithConstructorExplicitType & BeanWithConstructorExplicitTypeAsync = (...args: any[]): any => {
  if (args.length === 1 && typeof args[0] === 'function') {
    return {
      constructor: args[0],
      factory: (...constructorArgs: any[]) => new args[0](...constructorArgs)
    };
  }

  if (args.length === 1 && args[0] instanceof Promise) {
    return args[0].then((constructor: any) => {
      return {
        constructor,
        factory: (...constructorArgs: any[]) => new constructor(...constructorArgs)
      };
    });
  }

  throw ErrorBuilder.usageWithoutConfiguredDI('@Bean');
};
