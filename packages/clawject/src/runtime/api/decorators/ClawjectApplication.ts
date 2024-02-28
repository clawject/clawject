import { ErrorBuilder } from '../../ErrorBuilder';
import { DecoratorWithoutArguments, ModernClassDecorator } from './DecoratorTypes';

/** @public */
export type ClawjectApplicationTarget = ClassDecorator & ModernClassDecorator;

/**
 * Indicates that a target class is a {@link Configuration @Configuration} class and an entry point for the Clawject application.
 *
 * @docs https://clawject.com/docs/fundamentals/configurations
 *
 * @public
 */
export const ClawjectApplication: DecoratorWithoutArguments<ClawjectApplicationTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@ClawjectApplication');
};
