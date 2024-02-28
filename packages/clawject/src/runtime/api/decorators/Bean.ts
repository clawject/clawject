import { ClassConstructor } from '../ClassConstructor';
import { ErrorBuilder } from '../../ErrorBuilder';
import { RuntimeErrors } from '../RuntimeErrors';
import { DecoratorWithoutArguments, ModernClassFieldArrowFunctionDecorator, ModernClassFieldDecorator, ModernClassGetterDecorator, ModernClassMethodDecorator } from './DecoratorTypes';

/** @public */
export type BeanTarget = PropertyDecorator
  & MethodDecorator
  & ModernClassFieldDecorator
  & ModernClassGetterDecorator
  & ModernClassFieldArrowFunctionDecorator
  & ModernClassMethodDecorator;

/** @public */
export interface BeanConstructorFactory<T, C extends ClassConstructor<T>> {
  constructor: C;
  factory: (...args: ConstructorParameters<C>) => T;
}
/**
 * Indicates that a method/property produces/contains a bean or a bean constructor
 * to be managed by the Clawject container.
 *
 * @docs https://clawject.com/docs/fundamentals/bean
 *
 * @public
 */
export const Bean: {
  <C extends ClassConstructor<any>>(classConstructor: C): BeanConstructorFactory<InstanceType<C>, C>;
  <C extends ClassConstructor<any>>(classConstructor: Promise<C> | PromiseLike<C>): Promise<BeanConstructorFactory<InstanceType<C>, C>>;

  <T, C extends ClassConstructor<T>>(classConstructor: C): BeanConstructorFactory<T, C>;
  <T, C extends ClassConstructor<T>>(classConstructor: Promise<C> | PromiseLike<C>): Promise<BeanConstructorFactory<T, C>>;
} & DecoratorWithoutArguments<BeanTarget> = (...args: any[]): any => {
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

  if (args.length === 1) {
    throw new RuntimeErrors.IllegalArgumentError('Argument must be a class constructor or a promise of a class constructor');
  }

  throw ErrorBuilder.usageWithoutConfiguredDI('@Bean');
};
