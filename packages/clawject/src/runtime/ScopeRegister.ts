import { CustomScope } from './scope/CustomScope';
import { InternalScopeRegister } from './scope/InternalScopeRegister';

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
   * @docs https://clawject.org/docs/base-concepts/container-manager/#containermanagerregisterscope
   */
  static registerScope(scopeName: string, scope: CustomScope): void {
    InternalScopeRegister.registerScope(scopeName, scope);
  }

  /**
   * Unregistering a scope.
   *
   * @returns `true` if scope by given name existed and has been removed, or `false` if the scope does not exist.
   * */
  static unregisterScope(scopeName: string): boolean {
    return InternalScopeRegister.unregisterScope(scopeName);
  }

  /**
   * Checks whether the scope with the given name is registered.
   *
   * @returns `true` if scope by given name exists, or `false` if the scope does not exist.
   * */
  static hasScope(scopeName: string): boolean {
    return InternalScopeRegister.hasScope(scopeName);
  }
}
