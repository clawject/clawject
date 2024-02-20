import { ErrorBuilder } from '../../ErrorBuilder';

/** @public */
export type QualifierTarget = PropertyDecorator & MethodDecorator;
/**
 * Allows specifying custom bean name.
 *
 * @docs https://clawject.com/docs/base-concepts/qualifier
 *
 * @public
 */
export const Qualifier: (value: string) => QualifierTarget = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Qualifier');
};
