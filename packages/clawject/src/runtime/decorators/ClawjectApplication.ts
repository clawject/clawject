import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';
import { ErrorBuilder } from '../ErrorBuilder';

export type ClawjectApplicationTarget = ClassDecorator;

/** @public */
export const ClawjectApplication: DecoratorWithoutArguments<ClawjectApplicationTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@ClawjectApplication');
};
