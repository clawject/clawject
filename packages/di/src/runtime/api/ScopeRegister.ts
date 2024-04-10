import { Scope, ScopeValue } from './Scope';
import { InternalScopeRegister } from '../scope/InternalScopeRegister';

/**
 * `ScopeRegister` serves as the main entry point for working with globally defined scopes.
 * It allows you to register custom scopes, deregister them and check if they are registered for all instances of the application.
 *
 * @public
 * */
export class ScopeRegister {

  /**
   * Registers a custom scope for all instances of the application.
   *
   * @param scopeName - The name of the scope that should be registered.
   * @param scope - The custom scope object.
   *
   * @throws RuntimeErrors.DuplicateScopeError If the scope with the same name was already registered.
   *
   * @docs https://clawject.com/docs/fundamentals/scope-register#registerscope
   */
  static registerScope(scopeName: string | number, scope: Scope): void {
    InternalScopeRegister.global.registerScope(scopeName, scope);
  }

  /**
   * Registers an alias name for the scope.
   *
   * @param from - The name of the scope that should be aliased.
   * @param to - The name of the scope that should be used as an alias.
   *
   * @throws RuntimeErrors.ScopeIsNotRegisteredError If the scope with the name `from` is not registered.
   * @throws RuntimeErrors.DuplicateScopeError If the scope with the name `to` was already registered.
   *
   * @docs TODO
   */
  static registerScopeAlias(from: ScopeValue, to: string | number): void {
    InternalScopeRegister.global.registerScopeAlias(from, to);
  }

  /**
   * Check whether the scope with the given name is registered for all instances of the application.
   *
   * @returns `true` if scope by given name exists, or `false` if the scope does not exist.
   *
   * @docs https://clawject.com/docs/fundamentals/scope-register#hasscope
   * */
  static hasScope(scopeName: string | number): boolean {
    return InternalScopeRegister.global.hasScope(scopeName);
  }
}
