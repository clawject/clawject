import { ClassConstructor } from '../ClassConstructor';
import { ErrorBuilder } from '../ErrorBuilder';
import { Decorator } from './Decorator';

export type BeanTarget = PropertyDecorator & MethodDecorator;
export type BeanWithClassConstructor = <T, A extends any[], C extends ClassConstructor<T, A>>(classConstructor: C) =>
    (...args: ConstructorParameters<C>) => InstanceType<C>;
export const Bean: Decorator<BeanTarget> & BeanWithClassConstructor = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@Bean');
};
