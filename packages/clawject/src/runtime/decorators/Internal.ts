import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type InternalTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
/**
 * @public
 */
export const Internal: DecoratorWithoutArguments<InternalTarget> & ((value: boolean) => InternalTarget) = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Internal');
};
