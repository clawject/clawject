import type { Container } from './Container';
import { ContainerScope } from './ContainerScope';

export class ContainerScopeManager {
  constructor(
    private container: Container,
  ) {}

  private readonly scopes = new Map<string, ContainerScope>();

  //TODO verify if scope is already registered
  async registerScope(name: string, scope: ContainerScope): Promise<void> {
    this.scopes.set(name, scope);
    await scope.onScopeRegistered(this.container.applicationId, name);
  }

  getScope(name: string): ContainerScope {
    const scope = this.scopes.get(name);
    if (!scope) {
      //TODO specific error
      throw new Error(`Scope ${name} is not found`);
    }

    return scope;
  }
}
