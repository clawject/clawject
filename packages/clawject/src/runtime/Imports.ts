import { DecoratorWithoutArguments } from './decorators/index';
import { ErrorBuilder } from './ErrorBuilder';

/** @public */
export const Imports: DecoratorWithoutArguments<PropertyDecorator> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Imports');
};
