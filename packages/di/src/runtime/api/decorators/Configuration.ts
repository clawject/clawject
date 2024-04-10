import { ErrorBuilder } from '../../ErrorBuilder';
import { DecoratorWithoutArguments, ModernClassDecorator } from './DecoratorTypes';
import { ClawjectDecorator } from './ClawjectDecorator';

/** @public */
export type ConfigurationTarget = ClassDecorator & ModernClassDecorator;
/**
 * Indicates that a target class is a Configuration class, and can contains bean definitions, configuration imports.
 *
 * @docs https://clawject.com/docs/fundamentals/configurations
 *
 * @public
 */
export const Configuration: DecoratorWithoutArguments<ConfigurationTarget> & ClawjectDecorator<'Configuration'> = (() => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Configuration');
}) as any;
