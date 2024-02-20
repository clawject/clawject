import { ErrorBuilder } from '../../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

/** @public */
export type PrimaryTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
/**
 *
 * @docs https://clawject.com/docs/base-concepts/primary
 *
 * @public */
export const Primary: DecoratorWithoutArguments<PrimaryTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Primary');
};
