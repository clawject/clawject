import { ErrorBuilder } from '../ErrorBuilder';

type LazyWithValue = (this: void, value?: boolean) => PropertyDecorator & MethodDecorator;
export const Lazy: PropertyDecorator & MethodDecorator & LazyWithValue = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@Lazy');
};
