import { ErrorBuilder } from '../ErrorBuilder';

/** @public */
export type ScopeTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
/** @public */
export type ScopeValue = 'prototype' | 'singleton' | string;
/** @public */
export const Scope = (scope: ScopeValue): ScopeTarget => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Scope');
};
