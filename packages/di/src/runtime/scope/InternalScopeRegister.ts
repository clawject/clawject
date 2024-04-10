import { Scope, ScopeValue } from '../api/Scope';
import { SingletonScope } from './SingletonScope';
import { RuntimeErrors } from '../api/RuntimeErrors';
import { TransientScope } from './TransientScope';

export class InternalScopeRegister {
  static readonly global = new InternalScopeRegister(
    new Map<ScopeValue, Scope>([
      ['singleton', new SingletonScope()],
      ['transient', new TransientScope()],
    ])
  );

  readonly scopes: Map<string | number, Scope>;

  constructor(
    scopes?: Map<string | number, Scope>
  ) {
    this.scopes = new Map(scopes);
  }

  registerScope(name: string | number, scope: Scope): void {
    if (this.scopes.has(name)) {
      throw new RuntimeErrors.DuplicateScopeError(`Scope with name ${name} is already registered.`);
    }

    this.scopes.set(name, scope);
  }

  registerScopeAlias(from: string | number, to: string | number): void {
    if (this.hasScope(to)) {
      throw new RuntimeErrors.DuplicateScopeError(`Scope with name ${to} is already registered.`);
    }

    const scope = this.getScope(from);

    this.scopes.set(to, scope);
  }

  getScope(name: string | number): Scope {
    return this.assureRegistered(name);
  }

  hasScope(name: string | number): boolean {
    return this.scopes.has(name);
  }

  private assureRegistered(name: string | number): Scope | never {
    const scope = this.scopes.get(name);

    if (!scope) {
      throw new RuntimeErrors.ScopeIsNotRegisteredError(`Scope with name ${name} is not registered.`);
    }

    return scope;
  }
}
