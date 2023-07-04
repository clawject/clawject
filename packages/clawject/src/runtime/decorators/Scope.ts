import { ErrorBuilder } from '../ErrorBuilder';

export type ScopeTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
export type ScopeValue = 'prototype' | 'singleton' | string;
export const Scope = (scope: ScopeValue): ScopeTarget => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@Scope');
};
