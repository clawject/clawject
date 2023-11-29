import { ErrorBuilder } from '../ErrorBuilder';
import { Condition } from '../Condition';

/** @public */
export type ConditionalTarget = PropertyDecorator & MethodDecorator;
/**
 * Indicates whether a bean conditional or not.
 *
 * @docs TODO
 *
 * @public
 */
export const Conditional: ((value: boolean | Condition) => ConditionalTarget) = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Conditional');
};
