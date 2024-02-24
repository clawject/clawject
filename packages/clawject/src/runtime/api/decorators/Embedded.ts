import { ErrorBuilder } from '../../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type EmbeddedTarget = PropertyDecorator & MethodDecorator;
/**
 * When applied to {@link Bean} - all object members will be registered as a beans.
 *
 * @docs https://clawject.com/docs/fundamentals/embedded
 *
 * @public
 */
export const Embedded: DecoratorWithoutArguments<EmbeddedTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Embedded');
};
