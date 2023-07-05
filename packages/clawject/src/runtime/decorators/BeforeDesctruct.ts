import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

export type BeforeDestructTarget = PropertyDecorator & MethodDecorator;
export const BeforeDestruct: DecoratorWithoutArguments<BeforeDestructTarget> = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@BeforeDestruct');
};
