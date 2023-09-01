import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type PreDestroyTarget = PropertyDecorator & MethodDecorator;
/** @public */
export const PreDestroy: DecoratorWithoutArguments<PreDestroyTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@PreDestroy');
};
