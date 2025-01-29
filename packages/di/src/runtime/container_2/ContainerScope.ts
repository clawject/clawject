import { BeanDefinition } from '../api/bean/BeanDefinition';

export type ProviderRegistrationRequest<ContextId = unknown> = {
  key: symbol;
  definition: BeanDefinition<unknown>;
  factory: (contextId: unknown) => Promise<unknown>;
}

/**
 * @publicApi
 */
export interface ContainerScope<ContextId = unknown> {
  onScopeRegistered(applicationId: string, name: string): void | Promise<void>;

  registerProviders(
    applicationId: string,
    providers: ProviderRegistrationRequest<ContextId>[],
  ): void | Promise<void>;

  //TODO add parent bean definition?
  resolve(
    applicationId: string,
    contextId: ContextId,
    key: symbol,
    definition: BeanDefinition<unknown>,
    //Injected into scope:
    parentScope: ContainerScope | null,
  ): Promise<unknown>;

  ready(
    applicationId: string,
    contextId: ContextId,
    key: symbol,
    definition: BeanDefinition<unknown>,
    parentScope: ContainerScope | null,
  ): boolean;

  //TODO Should throw specific error if not found
  get(
    applicationId: string,
    contextId: ContextId,
    key: symbol,
    definition: BeanDefinition<unknown>,
    parentScope: ContainerScope | null,
  ): unknown;
}
