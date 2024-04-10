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
export class ClawjectFactoryStatic {
  private constructor(
    private beanProcessors: BeanProcessor[],
    private scopes: Map<string | number, Scope>,
  ) {}

  public static readonly instance = new ClawjectFactoryStatic([], InternalScopeRegister.global.scopes);

  private readonly scopeRegister = new InternalScopeRegister(this.scopes);

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
   * Creates new instance of {@link ClawjectFactoryStatic} with assigned {@link BeanProcessor}.
   * */
  withBeanProcessor(beanProcessor: BeanProcessor): ClawjectFactoryStatic {
    return new ClawjectFactoryStatic(
      [...this.beanProcessors, beanProcessor],
      this.scopes
    );
  }
  /**
   * Creates new instance of {@link ClawjectFactoryStatic} with assigned {@link Scope}.
   * */
  withScope(scopeName: string | number, scope: Scope): ClawjectFactoryStatic {
    return new ClawjectFactoryStatic(
      this.beanProcessors,
      new Map([...this.scopes, [scopeName, scope]])
    );
  }

  /**
   * Creates new instance of {@link ClawjectFactoryStatic} with assigned scope alias.
   * */
  withScopeAlias(from: ScopeValue, to: string | number): ClawjectFactoryStatic {
    const instance = new ClawjectFactoryStatic(
      this.beanProcessors,
      this.scopes
    );

    instance.scopeRegister.registerScopeAlias(from, to);

    return instance;
  }
}

/**
 * Use ClawjectFactory to create an application context instance.
 *
 * @public
 * */
export const ClawjectFactory: ClawjectFactoryStatic = ClawjectFactoryStatic.instance;
