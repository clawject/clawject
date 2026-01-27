import { ApplicationRunner, Bean, BeanDefinition, ClawjectApplication, Configuration, ContainerScope, Import, LazyConfigurationLoader, LazyImport, ProviderRegistrationRequest } from "@clawject/di";
import { BarConfiguration } from "./BarConfiguration";

export class Application {
  constructor() {
    console.log('Application constructor');
  }

  app = ClawjectApplication();
  barConfig = Import(BarConfiguration);
  fooConfig = LazyImport(async() => {
    const { FooConfiguration } = await import('./FooConfiguration');

    return FooConfiguration;
  })
}

class RequestScope implements ContainerScope<string> {
  private providers = new Map<symbol, ProviderRegistrationRequest>();
  private instances = new Map<string, Map<symbol, Promise<unknown>>>(); // contextId -> key -> instance

  async beginScope(contextId: string): Promise<void> {
    console.log('beginScope with contextId: ', contextId);
    await Promise.all(
      Array.from(this.providers.entries()).map(([key, provider]) => {
        this.resolve('mock_application_id', contextId, key, provider.definition, null);
      })
    )
  }

  onScopeRegistered(applicationId: string, name: string): void | Promise<void> {
    console.log('onScopeRegistered', applicationId, name);
  }

  async registerProviders(applicationId: string, providers: ProviderRegistrationRequest<unknown>[]): Promise<void> {
    console.log('registering providers...')
    for (const provider of providers) {
      this.providers.set(provider.key, provider);
    }

    //TODO skip lazy providers in initialization
    const result = await Promise.all(
      providers.map(async(provider) => {
        //Should be initialized for all context ids currently active
        const instance = await this.resolve('mock_application_id', 'context1', provider.key, provider.definition, null);

        await Promise.all(Array.from(provider.definition.metadata.initMethods).map(it => {
          return (instance as any)[it]();
        }))
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
    if (parentScope && !(parentScope instanceof RequestScope)) {
      throw new Error('Parent scope is not RequestScope');
    }

    if (!this.instances.has(contextId)) {
      this.instances.set(contextId, new Map());
    }
    const contextInstances = this.instances.get(contextId)!;
    if (!contextInstances.has(key)) {
      const provider = this.providers.get(key);
      if (!provider) {
        throw new Error('No factory found');
      }
      contextInstances.set(key, provider.factory(contextId));
    }
    return contextInstances.get(key)!;
  }

  ready(applicationId: string, contextId: string, key: symbol, definition: BeanDefinition<unknown>, parentScope: ContainerScope | null): boolean {
    throw new Error("Method not implemented.");
  }

  get(applicationId: string, contextId: string, key: symbol, definition: BeanDefinition<unknown>, parentScope: ContainerScope | null): unknown {
    throw new Error("Method not implemented.");
  }
}

(async () => {
  // const requestScope = new RequestScope()
  await new ApplicationRunner().run(Application, new Map());
  // await requestScope.beginScope('context1');
})();
