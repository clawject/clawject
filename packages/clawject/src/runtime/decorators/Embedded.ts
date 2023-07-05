import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

export type EmbeddedTarget = PropertyDecorator & MethodDecorator;
export const Embedded: DecoratorWithoutArguments<EmbeddedTarget> = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@Embedded');
};
