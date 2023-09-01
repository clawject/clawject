import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type LazyTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
/** @public */
export const Lazy: DecoratorWithoutArguments<LazyTarget> & ((value: boolean) => LazyTarget) = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Lazy');
};
