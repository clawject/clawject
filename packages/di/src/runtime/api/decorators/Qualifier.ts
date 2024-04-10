import { ErrorBuilder } from '../../ErrorBuilder';
import { BeanTarget } from './Bean';
import { ClawjectDecorator } from './ClawjectDecorator';

/**
 * Allows us to specify a name for a bean.
 *
 * @docs https://clawject.com/docs/fundamentals/qualifier
 *
 * @public
 */
export const Qualifier: ((value: string) => BeanTarget) & ClawjectDecorator<'Qualifier'> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Qualifier');
};
