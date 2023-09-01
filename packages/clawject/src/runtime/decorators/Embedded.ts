import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type EmbeddedTarget = PropertyDecorator & MethodDecorator;
/** @public */
export const Embedded: DecoratorWithoutArguments<EmbeddedTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Embedded');
};
