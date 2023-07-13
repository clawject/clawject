import { ErrorBuilder } from '../ErrorBuilder';
import { Decorator } from './Decorator';

export type PrimaryTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
export const Primary: Decorator<PrimaryTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Primary');
};
