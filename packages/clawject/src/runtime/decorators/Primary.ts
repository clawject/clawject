import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

export type PrimaryTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
export const Primary: DecoratorWithoutArguments<PrimaryTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Primary');
};
