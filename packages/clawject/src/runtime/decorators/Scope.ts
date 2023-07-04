import { ErrorBuilder } from '../ErrorBuilder';
import { BeanScope } from './Bean';

type ScopeTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
export const Scope = (scope: BeanScope): ScopeTarget => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@Scope');
};
