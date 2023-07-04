import { ClassConstructor } from '../ClassConstructor';
import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

type BeanTarget = PropertyDecorator & MethodDecorator;
export const Bean: DecoratorWithoutArguments<BeanTarget> & (<T>(this: void, classConstructor: ClassConstructor<T>) => T) = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@Bean');
};
