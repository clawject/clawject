import { CustomScope } from './CustomScope';
import { SingletonScope } from './SingletonScope';
import { PrototypeScope } from './PrototypeScope';
import { RuntimeErrors } from '../errors';

export class ScopeRegister {
  private static scopes = new Map<string, CustomScope>([
    ['singleton', new SingletonScope()],
    ['prototype', new PrototypeScope()],
  ]);

  static registerScope(name: string, scope: CustomScope): void {
    if (this.scopes.has(name)) {
      throw new RuntimeErrors.DuplicateScopeError(`Scope with name ${name} is already registered.`);
    }

    this.scopes.set(name, scope);
  }

  static getScope(name: string): CustomScope {
    this.assureRegistered(name);

    return this.scopes.get(name)!;
  }

  static assureRegistered(name: string): void | never {
    const scope = this.scopes.get(name);

    if (!scope) {
      throw new RuntimeErrors.ScopeIsNotRegisteredError(`Scope with name ${name} is not registered.`);
    }
  }
}
