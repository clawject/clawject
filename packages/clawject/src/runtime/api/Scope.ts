import { ObjectFactory, ObjectFactoryResult } from './ObjectFactory';
import { ErrorBuilder } from '../ErrorBuilder';

/**
 * The interface that represents a custom scope.
 * You should implement it if you want to register custom scope.
 *
 * @docs https://clawject.com/docs/advanced-concepts/custom-scopes
 *
 * @public
 */
export interface Scope {
  registerScopeBeginCallback(callback: () => Promise<void>): void;
  removeScopeBeginCallback(callback: () => Promise<void>): void;

  /**
   * Indicates whether a proxy should be injected or the raw object.
   *
   * In default scopes (singleton, transient) `false` value is returned from this method,
   * but if you want to implement your own scope (for example - http-request scope),
   * most likely you will need to return `true` from this method.
   *
   * Be careful with primitive values because they are not supported by JavaScript Proxies (at least for now),
   * and if bean with scope that returns `true` from this method will be created -
   * error will be thrown {@link RuntimeErrors.CouldNotBeProxiedError}.
   *
   * @returns boolean `true` if a proxy should be injected, `false` otherwise.
   */
  useProxy?(): boolean;

  get(name: string, objectFactory: ObjectFactory): Promise<ObjectFactoryResult> | ObjectFactoryResult;

  remove(name: string): ObjectFactoryResult | null;
  registerDestructionCallback(name: string, callback: () => void): void;
}

/** @public */
export type ScopeTarget = PropertyDecorator & MethodDecorator & ClassDecorator;
/** @public */
export type ScopeValue = 'singleton' | 'transient' | string | number;
/**
 * Specifies the scope of Bean or Beans when applied on {@link Configuration @Configuration} level.
 *
 * @docs https://clawject.com/docs/fundamentals/scope
 *
 * @public
 */
export const Scope = (scope: ScopeValue): ScopeTarget => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Scope');
};
