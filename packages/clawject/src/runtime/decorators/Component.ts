import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';
import { ErrorBuilder } from '../ErrorBuilder';

export type ComponentTarget = ClassDecorator;
export const Component: DecoratorWithoutArguments<ComponentTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Component');
};
