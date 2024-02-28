import { ErrorBuilder } from '../../ErrorBuilder';

import { DecoratorWithoutArguments, ModernClassDecorator, ModernClassFieldDecorator, ModernClassGetterDecorator, ModernClassMethodDecorator } from './DecoratorTypes';

/** @public */
export type LazyTarget = ClassDecorator
  & PropertyDecorator
  & MethodDecorator
  & ModernClassDecorator
  & ModernClassFieldDecorator
  & ModernClassGetterDecorator
  & ModernClassMethodDecorator

/**
 * Indicates whether a bean is to be lazily initialized.
 *
 * @docs https://clawject.com/docs/fundamentals/lazy
 *
 * @public
 */
export const Lazy: DecoratorWithoutArguments<LazyTarget> & ((value: boolean) => LazyTarget) = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Lazy');
};
