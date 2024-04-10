import { ErrorBuilder } from '../../ErrorBuilder';

import { DecoratorWithoutArguments } from './DecoratorTypes';
import { BeanTarget } from './Bean';
import { ClawjectDecorator } from './ClawjectDecorator';

/**
 * Indicates that a specific bean is a primary candidate for injection.
 *
 * @docs https://clawject.com/docs/fundamentals/primary
 *
 * @public */
export const Primary: DecoratorWithoutArguments<BeanTarget> & ClawjectDecorator<'Primary'> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Primary');
};
