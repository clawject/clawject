import { ErrorBuilder } from '../../ErrorBuilder';
import { BeanTarget } from './Bean';

/**
 * Allows us to specify a name for a bean.
 *
 * @docs https://clawject.com/docs/fundamentals/qualifier
 *
 * @public
 */
export const Qualifier: (value: string) => BeanTarget = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Qualifier');
};
