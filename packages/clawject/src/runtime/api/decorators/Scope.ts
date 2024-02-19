import { ErrorBuilder } from '../../ErrorBuilder';

/** @public */
export type ScopeTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
/** @public */
export type ScopeValue = 'singleton' | 'transient' | string | number;
/**
 * Allows specifying the scope of a bean or all beans in context if applied on a class-level.
 *
 * @docs https://clawject.org/docs/base-concepts/scope
 *
 * @public
 */
export const Scope = (scope: ScopeValue): ScopeTarget => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Scope');
};
