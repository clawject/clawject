import { ClassConstructor } from '../ClassConstructor';
import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

export type BeanTarget = PropertyDecorator & MethodDecorator;
export type BeanWithClassConstructorExplicitType = <T>(classConstructor: ClassConstructor<T>) => () => T;
export type BeanWithClassConstructor = <T, A extends any[], C extends ClassConstructor<T, A>>(classConstructor: C) =>
  (...args: ConstructorParameters<C>) => InstanceType<C>;
export const Bean: DecoratorWithoutArguments<BeanTarget> & BeanWithClassConstructor & BeanWithClassConstructorExplicitType = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Bean');
};
