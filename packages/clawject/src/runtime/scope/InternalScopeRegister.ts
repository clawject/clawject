import { CustomScope } from './CustomScope';
import { SingletonScope } from './SingletonScope';
import { FreshScope } from './FreshScope';
import { RuntimeErrors } from '../errors';
import { TransientScope } from './TransientScope';

export class InternalScopeRegister {
  private static scopes = new Map<string | number, CustomScope>([
    ['singleton', new SingletonScope()],
    ['fresh', new FreshScope()],
    ['transient', new TransientScope()],
  ]);

  static registerScope(name: string | number, scope: CustomScope): void {
    if (this.scopes.has(name)) {
      throw new RuntimeErrors.DuplicateScopeError(`Scope with name ${name} is already registered.`);
    }

    this.scopes.set(name, scope);
  }

  static unregisterScope(name: string | number): boolean {
    return this.scopes.delete(name);
  }

  static getScope(name: string): CustomScope {
    return this.assureRegistered(name);
  }

  static hasScope(name: string | number): boolean {
    return this.scopes.has(name);
  }

  static assureRegistered(name: string | number): CustomScope | never {
    const scope = this.scopes.get(name);

    if (!scope) {
      throw new RuntimeErrors.ScopeIsNotRegisteredError(`Scope with name ${name} is not registered.`);
    }

    return scope;
  }
}
