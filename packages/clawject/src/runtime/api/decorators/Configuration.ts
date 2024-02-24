import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';
import { ErrorBuilder } from '../../ErrorBuilder';

/** @public */
export type ConfigurationTarget = ClassDecorator;
/**
 * Indicates that a target class is a Configuration class, and can contains bean definitions, configuration imports.
 *
 * @docs https://clawject.com/docs/fundamentals/configurations
 *
 * @public
 */
export const Configuration: DecoratorWithoutArguments<ConfigurationTarget> = (() => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Configuration');
}) as any;
