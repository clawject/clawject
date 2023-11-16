import { CatContext } from '../CatContext';
import { ErrorBuilder } from '../ErrorBuilder';
import { BeanFactory } from './BeanFactory';
import { RuntimeBeanMetadata } from '../runtime-elements/RuntimeBeanMetadata';
import { RuntimeLifecycleMetadata } from '../runtime-elements/RuntimeLifecycleMetadata';
import { InternalScopeRegister } from '../scope/InternalScopeRegister';
import { ClassConstructor } from '../ClassConstructor';
import { RuntimeElementFactories } from '../runtime-elements/RuntimeElementFactories';
import { getStaticRuntimeElementFromConstructor, StaticRuntimeElement } from '../runtime-elements/StaticRuntimeElement';

type BuiltContext = {
  instance: CatContext;
  factories: RuntimeElementFactories;
}

export interface ContextMetadata {
  id: number;
  contextName: string;
  lifecycle: RuntimeLifecycleMetadata;
  beans: Record<string, RuntimeBeanMetadata>;
  lazy: boolean;
  scope: string;
  contextBuilder: () => BuiltContext;
}

export class ContextManager {
  static contextPool = new Map<ClassConstructor<CatContext>, Map<any, BuiltContext>>();
  static configPool = new Map<CatContext, any>();
  static beanFactories = new Map<CatContext, BeanFactory>();

  static instantiateContext(contextConstructor: ClassConstructor<CatContext>, key: any, config: any): CatContext {
    const contextMetadata = this.getContextMetadataOrThrow(contextConstructor);

    Object.values(contextMetadata.beans)
      .forEach(it => InternalScopeRegister.assureRegistered(it.scope ?? contextMetadata.scope));

    const builtContext = contextMetadata.contextBuilder();
    const beanFactory = new BeanFactory(
      contextMetadata.id,
      contextMetadata.contextName,
      contextMetadata.beans,
      contextMetadata.scope,
      builtContext.factories,
    );

    const contexts = this.contextPool.get(contextConstructor) ?? new Map();
    if (!this.contextPool.has(contextConstructor)) {
      this.contextPool.set(contextConstructor, contexts);
    }

    contexts.set(key, builtContext);
    this.configPool.set(builtContext.instance, config);
    this.beanFactories.set(builtContext.instance, beanFactory);

    this.postConstruct(contextMetadata, builtContext);

    return builtContext.instance;
  }

  static disposeContext(contextConstructor: ClassConstructor<CatContext>, key: any): void {
    const contextMetadata = this.getContextMetadataOrThrow(contextConstructor);

    const builtContext = this.contextPool.get(contextConstructor)?.get(key);

    if (!builtContext) {
      console.warn(`Context '${contextMetadata.contextName}' not found when trying to destroy it, key: `, key);
      return;
    }

    this.contextPool.delete(key);
    this.configPool.delete(builtContext.instance);
    this.beanFactories.delete(builtContext.instance);

    this.preDestroy(contextMetadata, builtContext);
  }

  static getConfigForInstance(instance: CatContext<any, any>): any {
    return this.configPool.get(instance);
  }

  static getBeanFactoryOrThrow(instance: CatContext): BeanFactory {
    const beanFactory = this.beanFactories.get(instance);

    if (!beanFactory) {
      throw ErrorBuilder.usageWithoutConfiguredDI();
    }

    return beanFactory;
  }

  static getContextMetadataOrThrow(contextConstructor: ClassConstructor<CatContext>): ContextMetadata {
    const metadata = getStaticRuntimeElementFromConstructor(
      contextConstructor,
      StaticRuntimeElement.CONTEXT_METADATA
    );

    if (!metadata) {
      throw ErrorBuilder.classNotInheritorOfCatContext(contextConstructor);
    }

    return metadata;
  }

  public static getPrivateBeanFromFactory(beanName: string, instance: CatContext<any, any>): any {
    const beanFactory = this.beanFactories.get(instance);

    if (!beanFactory) {
      throw ErrorBuilder.usageWithoutConfiguredDI();
    }

    return beanFactory.getBean(beanName);
  }

  private static postConstruct(contextMetadata: ContextMetadata, builtContext: BuiltContext): void {
    Object.entries(contextMetadata.beans).forEach(([beanName, beanConfig]) => {
      const isBeanLazy = beanConfig.lazy === null ? contextMetadata.lazy : beanConfig.lazy;

      if (!isBeanLazy && beanConfig.scope === 'singleton') {
        this.beanFactories.get(builtContext.instance)?.getBean(beanName);
      }
    });
    contextMetadata.lifecycle.POST_CONSTRUCT?.forEach((methodName) => {
      this.getElementFactory(contextMetadata, builtContext, methodName)();
    });
  }

  private static preDestroy(contextMetadata: ContextMetadata, builtContext: BuiltContext): void {
    Object.keys(contextMetadata.beans).forEach(beanName => {
      this.beanFactories.get(builtContext.instance)?.destroyBean(beanName);
    });

    contextMetadata.lifecycle.PRE_DESTROY?.forEach((methodName) => {
      this.getElementFactory(contextMetadata, builtContext, methodName)();
    });
  }

  private static getElementFactory(contextMetadata: ContextMetadata, builtContext: BuiltContext, name: string): () => any {
    const elementFactory = builtContext.factories[name];

    if (!elementFactory) {
      throw ErrorBuilder.noElementFactoryFound(contextMetadata.contextName, name);
    }

    return elementFactory;
  }
}
