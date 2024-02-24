import { ErrorBuilder } from '../../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type PrimaryTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
/**
 * Indicates that a specific bean is a primary candidate for injection.
 *
 * @docs https://clawject.com/docs/fundamentals/primary
 *
 * @public */
export const Primary: DecoratorWithoutArguments<PrimaryTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Primary');
};
