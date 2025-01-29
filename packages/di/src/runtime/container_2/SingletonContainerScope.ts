import { BeanDefinition } from '../api/bean/BeanDefinition';
import { ContainerScope, ProviderRegistrationRequest } from './ContainerScope';

export class SingletonContainerScope implements ContainerScope<string> {
  static readonly SCOPE_NAME = 'singleton';
  static readonly CONTEXT_ID = 'SINGLETON_CONTEXT_ID';

  private factories = new Map<symbol, ProviderRegistrationRequest>();
  private instances = new Map<symbol, Promise<unknown>>();
  private instancesSync = new Map<symbol, unknown>();

  onScopeRegistered(applicationId: string, name: string): void {}

  async registerProviders(
    applicationId: string,
    providers: ProviderRegistrationRequest[]
  ): Promise<void> {
    for (const provider of providers) {
      this.factories.set(provider.key, provider);
    }

    await Promise.all(
      Array.from(this.factories.entries()).map(([key, provider]) => {
        this.resolve('mock_application_id', SingletonContainerScope.CONTEXT_ID, key, provider.definition, null);
      })
    )
  }

  resolve(
    applicationId: string,
    contextId: string,
    key: symbol,
    definition: BeanDefinition<unknown>,
    parentScope: ContainerScope | null
  ): Promise<unknown> {
    const provider = this.factories.get(key);
    if (!provider) {
      //TODO specific error?
      throw new Error('No factory found');
    }

    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        provider.factory(SingletonContainerScope.CONTEXT_ID).then((result) => {
          this.instancesSync.set(key, result);
          return result;
        })
      );
    }

    return this.instances.get(key)!;
  }

  ready(
    applicationId: string,
    contextId: string,
    key: symbol,
    definition: BeanDefinition<unknown>,
    parentScope: ContainerScope | null
  ): boolean {
    return this.instancesSync.has(key);
  }

  get(
    applicationId: string,
    contextId: string,
    key: symbol,
    definition: BeanDefinition<unknown>,
    parentScope: ContainerScope | null
  ): unknown {
    if (!this.ready(applicationId, contextId, key, definition, parentScope)) {
      throw new Error('No instance found');
    }

    return this.instancesSync.get(key);
  }
}
