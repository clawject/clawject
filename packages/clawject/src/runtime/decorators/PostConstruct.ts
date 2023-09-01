import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type PostConstructTarget = PropertyDecorator & MethodDecorator;
/** @public */
export const PostConstruct: DecoratorWithoutArguments<PostConstructTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@PostConstruct');
};
