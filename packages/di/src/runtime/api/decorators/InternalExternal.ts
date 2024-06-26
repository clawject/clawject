import { ErrorBuilder } from '../../ErrorBuilder';

import { DecoratorWithoutArguments, ModernClassDecorator, ModernClassFieldDecorator, ModernClassGetterDecorator, ModernClassMethodDecorator } from './DecoratorTypes';
import { ClawjectDecorator } from './ClawjectDecorator';

/** @public */
export type InternalExternalTarget = ClassDecorator
  & PropertyDecorator
  & MethodDecorator
  & ModernClassDecorator
  & ModernClassFieldDecorator
  & ModernClassGetterDecorator
  & ModernClassMethodDecorator

/**
 * It Indicates that the bean or configuration import is only visible within the class in which it is applied.
 * When applied on class level,
 * all beans and configuration imports defined in the class are only visible within the class.
 *
 * @docs https://clawject.com/docs/fundamentals/internal-external#internal
 *
 * @public
 */
export const External: DecoratorWithoutArguments<InternalExternalTarget> & ((value: boolean) => InternalExternalTarget) & ClawjectDecorator<'External'> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@External');
};

/**
 * It Indicates that the bean or configuration import is visible outside the class in which they are defined.
 * When applied on class level, all beans and configuration imports defined in the class become visible outside the class.
 *
 * @docs https://clawject.com/docs/fundamentals/internal-external#external
 *
 * @public
 */
export const Internal: DecoratorWithoutArguments<InternalExternalTarget> & ((value: boolean) => InternalExternalTarget) & ClawjectDecorator<'Internal'> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Internal');
};
