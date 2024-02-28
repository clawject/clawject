import { ErrorBuilder } from '../../ErrorBuilder';
import { Condition } from '../Condition';
import { ModernClassFieldArrowFunctionDecorator, ModernClassFieldDecorator, ModernClassGetterDecorator, ModernClassMethodDecorator } from './DecoratorTypes';

/** @public */
export type ConditionalTarget = PropertyDecorator
  & MethodDecorator
  & ModernClassGetterDecorator
  & ModernClassFieldDecorator
  & ModernClassFieldArrowFunctionDecorator
  & ModernClassMethodDecorator;
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
