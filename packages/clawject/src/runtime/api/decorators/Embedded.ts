import { ErrorBuilder } from '../../ErrorBuilder';

import { DecoratorWithoutArguments } from './DecoratorTypes';
import { BeanTarget } from './Bean';

/**
 * When applied to {@link Bean} - all object members will be registered as a beans.
 *
 * @docs https://clawject.com/docs/fundamentals/embedded
 *
 * @public
 */
export const Embedded: DecoratorWithoutArguments<BeanTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Embedded');
};
