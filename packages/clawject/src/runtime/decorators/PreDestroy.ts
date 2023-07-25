import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

export type PreDestroyTarget = PropertyDecorator & MethodDecorator;
export const PreDestroy: DecoratorWithoutArguments<PreDestroyTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@PreDestroy');
};
