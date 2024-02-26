import { Scope } from '../api/Scope';
import { SingletonScope } from './SingletonScope';
import { RuntimeErrors } from '../api/RuntimeErrors';
import { TransientScope } from './TransientScope';

export class InternalScopeRegister {
  private static scopes = new Map<string | number, Scope>([
    ['singleton', new SingletonScope()],
    ['transient', new TransientScope()],
  ]);

  static registerScope(name: string | number, scope: Scope): void {
    if (this.scopes.has(name)) {
      throw new RuntimeErrors.DuplicateScopeError(`Scope with name ${name} is already registered.`);
    }

    this.scopes.set(name, scope);
  }

  static getScope(name: string | number): Scope {
    return this.assureRegistered(name);
  }

  static hasScope(name: string | number): boolean {
    return this.scopes.has(name);
  }

  private static assureRegistered(name: string | number): Scope | never {
    const scope = this.scopes.get(name);

    if (!scope) {
      throw new RuntimeErrors.ScopeIsNotRegisteredError(`Scope with name ${name} is not registered.`);
    }

    return scope;
  }
}
