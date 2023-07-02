import { ErrorBuilder } from '../ErrorBuilder';
import { BeanScope } from './Bean';

export function Scope(this: void, scope: BeanScope): PropertyDecorator & MethodDecorator & ClassDecorator {
    throw ErrorBuilder.usageWithoutConfiguredDI('@Scope');
}
