import { ClassConstructor } from '../ClassConstructor';
import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type BeanTarget = PropertyDecorator & MethodDecorator;
/** @public */
export type BeanWithClassConstructorExplicitType = <T>(classConstructor: ClassConstructor<T>) => () => T;
/** @public */
export type BeanWithClassConstructor = <T, A extends any[], C extends ClassConstructor<T, A>>(classConstructor: C) =>
  (...args: ConstructorParameters<C>) => InstanceType<C>;
/** @public */
export const Bean: DecoratorWithoutArguments<BeanTarget> & BeanWithClassConstructor & BeanWithClassConstructorExplicitType = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Bean');
};
