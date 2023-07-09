import { ErrorBuilder } from '../ErrorBuilder';
import { Decorator } from './Decorator';

export type EmbeddedTarget = PropertyDecorator & MethodDecorator;
export const Embedded: Decorator<EmbeddedTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Embedded');
};
