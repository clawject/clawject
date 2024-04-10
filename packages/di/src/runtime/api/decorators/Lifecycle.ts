import { ErrorBuilder } from '../../ErrorBuilder';

import { DecoratorWithoutArguments, ModernClassFieldDecorator, ModernClassMethodDecorator } from './DecoratorTypes';
import { ClawjectDecorator } from './ClawjectDecorator';

/** @public */
export type LifecycleFunctionTarget = PropertyDecorator
  & MethodDecorator
  & ModernClassFieldDecorator
  & ModernClassMethodDecorator;
/**
 * Indicates that an annotated method or property with arrow function should be called
 * after configuration or the bean has been constructed.
 *
 * @docs https://clawject.com/docs/fundamentals/lifecycle#postconstruct
 *
 * @public */
export const PostConstruct: DecoratorWithoutArguments<LifecycleFunctionTarget> & ClawjectDecorator<'PostConstruct'> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@PostConstruct');
};

/**
 * Indicates that an annotated method or property with arrow function should be called
 * before the application context will be closed or the bean will be destroyed.
 *
 * @docs https://clawject.com/docs/fundamentals/lifecycle#predestroy
 *
 * @public */
export const PreDestroy: DecoratorWithoutArguments<LifecycleFunctionTarget> & ClawjectDecorator<'PreDestroy'> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@PreDestroy');
};
