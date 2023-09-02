import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type PreDestroyTarget = PropertyDecorator & MethodDecorator;
/**
 * Allows invoking a decorated method or property with arrow function before context is cleared or bean is destroyed.
 *
 * @docs https://clawject.org/docs/base-concepts/postconstruct-predestroy
 *
 * @see PostConstruct
 *
 * @public */
export const PreDestroy: DecoratorWithoutArguments<PreDestroyTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@PreDestroy');
};
