import { ErrorBuilder } from '../../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type ExternalTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
/**
 * @public
 */
export const External: DecoratorWithoutArguments<ExternalTarget> & ((value: boolean) => ExternalTarget) = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@External');
};
