import { ClassConstructor } from '../ClassConstructor';
import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

export type BeanTarget = PropertyDecorator & MethodDecorator;
export type BeanWithClassConstructor = <T, A extends any[], C extends ClassConstructor<T, A>>(classConstructor: C) =>
    (...args: ConstructorParameters<C>) => InstanceType<C>;
export const Bean: DecoratorWithoutArguments<BeanTarget> & BeanWithClassConstructor = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@Bean');
};
