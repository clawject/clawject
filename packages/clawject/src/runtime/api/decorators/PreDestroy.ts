import { ErrorBuilder } from '../../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type PreDestroyTarget = PropertyDecorator & MethodDecorator;
/**
 * Indicates that an annotated method or property with arrow function should be called
 * before the application context will be closed or the bean will be destroyed.
 *
 * @docs https://clawject.com/docs/fundamentals/lifecycle#predestroy
 *
 * @public */
export const PreDestroy: DecoratorWithoutArguments<PreDestroyTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@PreDestroy');
};
