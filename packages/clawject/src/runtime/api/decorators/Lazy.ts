import { ErrorBuilder } from '../../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type LazyTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
/**
 * Indicates whether a bean is to be lazily initialized.
 *
 * @docs https://clawject.com/docs/base-concepts/lazy
 *
 * @public
 */
export const Lazy: DecoratorWithoutArguments<LazyTarget> & ((value: boolean) => LazyTarget) = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Lazy');
};
