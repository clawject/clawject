import { Scope } from './Scope';
import { InternalScopeRegister } from '../scope/InternalScopeRegister';

/**
 * `ScopeRegister` serves as the main entry point for working with scopes.
 * It allows you to register custom scopes, deregister them and check if they are registered.
 *
 * @public
 * */
export class ScopeRegister {

  /**
   * Registers a custom scope.
   *
   * @param scopeName - The name of the scope that should be registered.
   * @param scope - The custom scope object.
   *
   * @throws RuntimeErrors.DuplicateScopeError If the scope with the same name was already registered.
   *
   * @docs https://clawject.com/docs/fundamentals/scope-register#registerscope
   */
  static registerScope(scopeName: string | number, scope: Scope): void {
    InternalScopeRegister.registerScope(scopeName, scope);
  }

  /**
   * Check whether the scope with the given name is registered.
   *
   * @returns `true` if scope by given name exists, or `false` if the scope does not exist.
   *
   * @docs https://clawject.com/docs/fundamentals/scope-register#hasscope
   * */
  static hasScope(scopeName: string | number): boolean {
    return InternalScopeRegister.hasScope(scopeName);
  }
}
