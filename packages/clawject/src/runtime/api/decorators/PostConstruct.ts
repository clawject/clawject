import { ErrorBuilder } from '../../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type PostConstructTarget = PropertyDecorator & MethodDecorator;
/**
 * Allows invoking a decorated method or property with arrow function after context is constructed or bean is created.
 *
 * @docs https://clawject.org/docs/base-concepts/postconstruct-predestroy
 *
 * @see PreDestroy
 *
 * @public */
export const PostConstruct: DecoratorWithoutArguments<PostConstructTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@PostConstruct');
};
