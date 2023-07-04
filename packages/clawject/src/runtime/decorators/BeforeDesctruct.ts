import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';


type BeforeDestructTarget = PropertyDecorator & MethodDecorator;
export const BeforeDestruct: DecoratorWithoutArguments<BeforeDestructTarget> = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@BeforeDestruct');
};
