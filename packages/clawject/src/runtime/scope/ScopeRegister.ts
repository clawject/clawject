import { Scope } from './Scope';

export class ScopeRegister {
    private static scopes = new Map<string, Scope>();

    static registerScope(name: string, scope: Scope): void {
        if (this.scopes.has(name)) {
            throw new Error(`Scope with name ${name} is already registered.`);
        }

        this.scopes.set(name, scope);
    }

    static getScope(name: string): Scope {
        const scope = this.scopes.get(name);

        if (!scope) {
            throw new Error(`Scope with name ${name} is not registered.`);
        }

        return scope;
    }
}
