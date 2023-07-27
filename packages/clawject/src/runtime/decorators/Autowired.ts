import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';
import { ErrorBuilder } from '../ErrorBuilder';

export type AutowiredTarget = PropertyDecorator;
export const Autowired: DecoratorWithoutArguments<AutowiredTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Autowired');
};

