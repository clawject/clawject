import { ErrorBuilder } from '../../ErrorBuilder';

import { DecoratorWithoutArguments } from './DecoratorTypes';
import { BeanTarget } from './Bean';
import { ClawjectDecorator } from './ClawjectDecorator';

/**
 * Tells clawject to treat bean as a factory function instead of treating as a plain value.
 * Can be applied only to beans.
 * Bean to which this decorator is applied should have exactly one call signature.
 *
 * @public
 */
export const Factory: DecoratorWithoutArguments<BeanTarget> & ClawjectDecorator<'Factory'> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Factory');
};
