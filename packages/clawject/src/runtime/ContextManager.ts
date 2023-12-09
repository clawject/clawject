import { CatContext } from './CatContext';
import { ErrorBuilder } from './ErrorBuilder';
import { BeanFactory } from './BeanFactory';
import { InternalScopeRegister } from './scope/InternalScopeRegister';
import { ClassConstructor } from './ClassConstructor';
import { BuiltContext, RuntimeContextMetadata } from './metadata/RuntimeContextMetadata';
import { MetadataStorage } from './metadata/MetadataStorage';
import { InternalUtils } from './InternalUtils';

class ContextManagerStore {
  contextPool = new Map<ClassConstructor<CatContext>, Map<any, BuiltContext>>();
  configPool = new Map<CatContext, any>();
  beanFactories = new Map<CatContext, BeanFactory>();

  configToAssignDuringContextInstantiation: any = undefined;
}

export class ContextManager {
  private static storage = InternalUtils.createVersionedStorageOrGetIfExisted('context_manager_storage', 0, new ContextManagerStore());

  static assignConfigDuringInstantiation(instance: any): void {
    this.storage.configPool.set(instance, this.storage.configToAssignDuringContextInstantiation);
  }

  static instantiateContext(contextConstructor: ClassConstructor<CatContext>, key: any, config: any): CatContext {
    const contextMetadata = this.getContextMetadataOrThrow(contextConstructor);

    Object.values(contextMetadata.beans)
      .forEach(it => InternalScopeRegister.assureRegistered(it.scope ?? contextMetadata.scope));

    this.storage.configToAssignDuringContextInstantiation = config;
    let builtContext: BuiltContext;

    try {
      builtContext = contextMetadata.contextBuilder();
    } finally {
      this.storage.configToAssignDuringContextInstantiation = undefined;
    }

    const beanFactory = new BeanFactory(
      contextMetadata,
      builtContext.factories,
    );

    const contexts = this.storage.contextPool.get(contextConstructor) ?? new Map();
    if (!this.storage.contextPool.has(contextConstructor)) {
      this.storage.contextPool.set(contextConstructor, contexts);
    }

    contexts.set(key, builtContext);
    this.storage.beanFactories.set(builtContext.instance, beanFactory);

    this.postConstruct(contextMetadata, builtContext);

    return builtContext.instance;
  }

  static disposeContext(contextConstructor: ClassConstructor<CatContext>, key: any): void {
    const contextMetadata = this.getContextMetadataOrThrow(contextConstructor);

    const builtContext = this.storage.contextPool.get(contextConstructor)?.get(key);

    if (!builtContext) {
      console.warn(`Context '${contextMetadata.contextName}' not found when trying to destroy it, key: `, key);
      return;
    }

    this.storage.contextPool.delete(key);
    this.storage.configPool.delete(builtContext.instance);
    this.storage.beanFactories.delete(builtContext.instance);

    this.preDestroy(contextMetadata, builtContext);
  }

  static getConfigForInstance(instance: CatContext<any, any>): any {
    return this.storage.configPool.get(instance);
  }

  static getBeanFactoryOrThrow(instance: CatContext): BeanFactory {
    const beanFactory = this.storage.beanFactories.get(instance);

    if (!beanFactory) {
      throw ErrorBuilder.usageWithoutConfiguredDI();
    }

    return beanFactory;
  }

  static getContextMetadataOrThrow(contextConstructor: ClassConstructor<CatContext>): RuntimeContextMetadata {
    const metadata = MetadataStorage.getContextMetadata(contextConstructor);

    if (!metadata) {
      throw ErrorBuilder.noClassMetadataFoundError(contextConstructor);
    }

    return metadata;
  }

  public static getPrivateBeanFromFactory(beanName: string, instance: CatContext<any, any>): any {
    const beanFactory = this.storage.beanFactories.get(instance);

    if (!beanFactory) {
      throw ErrorBuilder.usageWithoutConfiguredDI();
    }

    return beanFactory.getBean(beanName);
  }

  private static postConstruct(contextMetadata: RuntimeContextMetadata, builtContext: BuiltContext): void {
    Object.entries(contextMetadata.beans).forEach(([beanName, beanConfig]) => {
      const isBeanLazy = beanConfig.lazy ?? contextMetadata.lazy;
      const beanScope = beanConfig.scope ?? contextMetadata.scope;

      if (!isBeanLazy && beanScope === 'singleton') {
        this.storage.beanFactories.get(builtContext.instance)?.getBean(beanName);
      }
    });
    contextMetadata.lifecycle.POST_CONSTRUCT?.forEach((methodName) => {
      this.getElementFactory(contextMetadata, builtContext, methodName)();
    });
  }

  private static preDestroy(contextMetadata: RuntimeContextMetadata, builtContext: BuiltContext): void {
    Object.keys(contextMetadata.beans).forEach(beanName => {
      this.storage.beanFactories.get(builtContext.instance)?.destroyBean(beanName);
    });

    contextMetadata.lifecycle.PRE_DESTROY?.forEach((methodName) => {
      this.getElementFactory(contextMetadata, builtContext, methodName)();
    });
  }

  private static getElementFactory(contextMetadata: RuntimeContextMetadata, builtContext: BuiltContext, name: string): () => any {
    const elementFactory = builtContext.factories[name];

    if (!elementFactory) {
      throw ErrorBuilder.noContextMemberFactoryFound(contextMetadata.contextName, name);
    }

    return elementFactory;
  }
}
