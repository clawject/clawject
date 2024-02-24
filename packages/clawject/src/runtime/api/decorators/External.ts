import { ErrorBuilder } from '../../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type ExternalTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
/**
 * It Indicates that the bean or configuration import is only visible within the class in which it is applied.
 * When applied on class level,
 * all beans and configuration imports defined in the class are only visible within the class.
 *
 * @docs https://clawject.com/docs/fundamentals/internal-external#internal
 *
 * @public
 */
export const External: DecoratorWithoutArguments<ExternalTarget> & ((value: boolean) => ExternalTarget) = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@External');
};
