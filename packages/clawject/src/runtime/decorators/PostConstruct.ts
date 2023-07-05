import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

export type PostConstructTarget = PropertyDecorator & MethodDecorator;
export const PostConstruct: DecoratorWithoutArguments<PostConstructTarget> = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@PostConstruct');
};
