import { ErrorBuilder } from '../../ErrorBuilder';

import { DecoratorWithoutArguments } from './DecoratorTypes';
import { BeanTarget } from './Bean';

/**
 * Indicates that a specific bean is a primary candidate for injection.
 *
 * @docs https://clawject.com/docs/fundamentals/primary
 *
 * @public */
export const Primary: DecoratorWithoutArguments<BeanTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Primary');
};
