import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

export type LazyTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
export const Lazy: DecoratorWithoutArguments<LazyTarget> & ((value?: boolean) => LazyTarget) = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@Lazy');
};
