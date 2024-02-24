import { ErrorBuilder } from '../../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type PostConstructTarget = PropertyDecorator & MethodDecorator;
/**
 * Indicates that an annotated method or property with arrow function should be called
 * after configuration or the bean has been constructed.
 *
 * @docs https://clawject.com/docs/fundamentals/lifecycle#postconstruct
 *
 * @public */
export const PostConstruct: DecoratorWithoutArguments<PostConstructTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@PostConstruct');
};
