import { ErrorBuilder } from '../ErrorBuilder';
import { Decorator } from './Decorator';

export type PreDestroyTarget = PropertyDecorator & MethodDecorator;
export const PreDestroy: Decorator<PreDestroyTarget> = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@PreDestroy');
};
