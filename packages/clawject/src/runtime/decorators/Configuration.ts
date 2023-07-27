import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';
import { ErrorBuilder } from '../ErrorBuilder';

export type ConfigurationTarget = ClassDecorator;
export const Configuration: DecoratorWithoutArguments<ConfigurationTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Configuration');
};
