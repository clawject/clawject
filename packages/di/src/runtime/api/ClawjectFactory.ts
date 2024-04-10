import { ClassConstructor } from './ClassConstructor';
import { ClawjectContainer } from '../container/ClawjectContainer';
import { InstantiationConstructorParameters } from './InstantiationConstructorParameters';
import { Utils } from '../Utils';
import { ClawjectApplicationContext } from './ClawjectApplicationContext';
import { ClawjectApplicationContextImpl } from '../ClawjectApplicationContextImpl';

import { BeanProcessor } from './BeanProcessor';
import { Scope, ScopeValue } from './Scope';
import { InternalScopeRegister } from '../scope/InternalScopeRegister';

/**
 * It's a factory class that creates a {@link ClawjectApplicationContext} instance.
 *
 * @docs https://clawject.com/docs/fundamentals/clawject-factory
 *
 * @public
 * */
export class ClawjectFactory {
  private constructor() {}

  private static readonly instance = new ClawjectFactory();

  private readonly beanProcessors: BeanProcessor[] = [];
  private readonly scopeRegister = new InternalScopeRegister(InternalScopeRegister.global.scopes);

  /**
   * Static method that creates a {@link ClawjectApplicationContext} instance.
   * */
  static async createApplicationContext<C extends ClassConstructor<any, []>>(clawjectApplication: C): Promise<ClawjectApplicationContext<C>>
  /**
   * Static method that creates a {@link ClawjectApplicationContext} instance.
   * */
  static async createApplicationContext<C extends ClassConstructor<any>>(clawjectApplication: C, constructorParameters: InstantiationConstructorParameters<ConstructorParameters<C>>): Promise<ClawjectApplicationContext<C>>
  static async createApplicationContext<C extends ClassConstructor<any>>(clawjectApplication: C, constructorParameters?: any): Promise<ClawjectApplicationContext<C>> {
    return this.instance.createApplicationContext(clawjectApplication, constructorParameters);
  }

  /**
   * Creates a {@link ClawjectApplicationContext} instance.
   *
   * @param clawjectApplication - The class that is annotated with {@link ClawjectApplication @ClawjectApplication}.
   * */
  async createApplicationContext<C extends ClassConstructor<any, []>>(clawjectApplication: C): Promise<ClawjectApplicationContext<C>>
  /**
   * Creates a {@link ClawjectApplicationContext} instance.
   *
   * @param clawjectApplication - The class that is annotated with {@link ClawjectApplication @ClawjectApplication}.
   * @param constructorParameters - The constructor parameters of the `clawjectApplication` class.
   * */
  async createApplicationContext<C extends ClassConstructor<any>>(clawjectApplication: C, constructorParameters: InstantiationConstructorParameters<ConstructorParameters<C>>): Promise<ClawjectApplicationContext<C>>
  async createApplicationContext<C extends ClassConstructor<any>>(clawjectApplication: C, constructorParameters?: any): Promise<ClawjectApplicationContext<C>> {
    const resolvedConstructorParameters = await Utils.getResolvedConstructorParameters(constructorParameters);
    const container = new ClawjectContainer(clawjectApplication, resolvedConstructorParameters, this.beanProcessors, this.scopeRegister);

    await container.init();
    await container.postInit();

    return new ClawjectApplicationContextImpl(container);
  }

  /**
   * Static method that creates a {@link ClawjectFactory} instance with a {@link BeanProcessor}.
   * */
  static withBeanProcessor(beanProcessor: BeanProcessor): ClawjectFactory {
    const instance = new ClawjectFactory();

    return instance.withBeanProcessor(beanProcessor);
  }
  /**
   * Adds a {@link BeanProcessor} to the future application context.
   * */
  withBeanProcessor(beanProcessor: BeanProcessor): this {
    this.beanProcessors.push(beanProcessor);

    return this;
  }

  /**
   * Static method that creates a {@link ClawjectFactory} instance with a specified {@link Scope}.
   * */
  static withScope(scopeName: string | number, scope: Scope): ClawjectFactory {
    const instance = new ClawjectFactory();

    return instance.withScope(scopeName, scope);
  }
  /**
   * Adds a {@link Scope} to the future application context.
   * */
  withScope(scopeName: string | number, scope: Scope): this {
    this.scopeRegister.registerScope(scopeName, scope);

    return this;
  }

  /**
   * Static method that creates a {@link ClawjectFactory} instance with a scope name alias.
   * */
  static withScopeAlias(from: ScopeValue, to: string | number): ClawjectFactory {
    const instance = new ClawjectFactory();

    return instance.withScopeAlias(from, to);
  }
  /**
   * Adds a scope name alias to the future application context.
   * */
  withScopeAlias(from: ScopeValue, to: string | number): this {
    this.scopeRegister.registerScopeAlias(from, to);

    return this;
  }
}
