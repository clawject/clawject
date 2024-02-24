import { ErrorBuilder } from '../../ErrorBuilder';

/** @public */
export type QualifierTarget = PropertyDecorator & MethodDecorator;
/**
 * Allows us to specify a name for a bean.
 *
 * @docs https://clawject.com/docs/fundamentals/qualifier
 *
 * @public
 */
export const Qualifier: (value: string) => QualifierTarget = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Qualifier');
};
