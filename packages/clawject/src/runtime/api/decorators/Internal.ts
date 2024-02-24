import { ErrorBuilder } from '../../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type InternalTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
/**
 * It Indicates that the bean or configuration import is visible outside the class in which they are defined.
 * When applied on class level, all beans and configuration imports defined in the class become visible outside the class.
 *
 * @docs https://clawject.com/docs/fundamentals/internal-external#external
 *
 * @public
 */
export const Internal: DecoratorWithoutArguments<InternalTarget> & ((value: boolean) => InternalTarget) = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Internal');
};
