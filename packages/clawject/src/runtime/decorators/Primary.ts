import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type PrimaryTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
/** @public */
export const Primary: DecoratorWithoutArguments<PrimaryTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Primary');
};
