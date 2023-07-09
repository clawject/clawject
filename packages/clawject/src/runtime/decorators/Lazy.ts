import { ErrorBuilder } from '../ErrorBuilder';
import { Decorator } from './Decorator';

export type LazyTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
export const Lazy: Decorator<LazyTarget> & ((value?: boolean) => LazyTarget) = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Lazy');
};
