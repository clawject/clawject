import { ErrorBuilder } from './ErrorBuilder';
import { ContextManager } from './___internal___/ContextManager';

/**
 * Class that represents the IoC container.
 * The container is responsible for instantiating,
 * configuring and assembling objects known as Beans and managing their life cycles.
 *
 * It's an abstract class that can be extended to create a custom container.
 *
 * @typeParam T - Plain object of beans
 * that will be accessible via {@link InitializedContext#getBean} or {@link InitializedContext#getBeans}.
 *
 * @typeParam C - Config that will be passed in context initialization stage.
 *
 * @see Bean
 * @docs https://clawject.org/docs/base-concepts/cat-context
 * @public
 */
export abstract class CatContext<T extends object = {}, C = undefined> {
  /**
   * Returns config object
   * that was passed in context initialization stage via {@link ContainerManager#init} or {@link ContainerManager#getOrInit}.
   *
   * @docs https://clawject.org/docs/base-concepts/cat-context/#config
   * */
  protected get config(): C {
    return ContextManager.getConfigForInstance(this);
  }

  /**
   * Needed to save type reference for {@link ContainerManager ContainerManagers} {@link ContainerManager#init init}/{@link ContainerManager#get get}/{@link ContainerManager#getOrInit getOrInit} methods.
   * Accessing this property will always throw an error.
   *
   * @throws IllegalAccessError if you'll try to access this property.
   * */
  protected get clawject_context_type(): T {
    throw ErrorBuilder.illegalAccess('CatContext.clawject_context_type');
  }
}
