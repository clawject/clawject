import { CatContext } from './CatContext';
import { InitializedContextImpl } from './InitializedContextImpl';
import { InitializedContext } from './InitializedContext';
import { ContainerManager, ContextInit, ContextInitConfig } from './ContainerManager';
import { ErrorBuilder } from './ErrorBuilder';
import { ClassConstructor } from './ClassConstructor';
import { ContextManager } from './___internal___/ContextManager';
import { ClawjectObjectStorage } from '@clawject/object-storage';

const DEFAULT_KEY = undefined;

const DEFAULT_INIT: ContextInit = {
  key: DEFAULT_KEY,
};

type InstancesType = Map<ClassConstructor<CatContext<any>>, Map<any, InitializedContext<any>>>;

export class ContainerManagerImpl implements ContainerManager {
  private STORAGE_KEY = 'cat_context_instances_storage';
  private VERSION = 0;
  declare private instances: InstancesType;

  constructor() {
    const instanceStorages = ClawjectObjectStorage.getOrSetIfNotPresent(this.STORAGE_KEY, new Map<number, InstancesType>());

    let instanceStorage = instanceStorages.get(this.VERSION);

    if (!instanceStorage) {
      instanceStorage = new Map();
      instanceStorages.set(this.VERSION, instanceStorage);
    }

    this.instances = instanceStorage;
  }

  init<T extends {}>(context: ClassConstructor<CatContext<T>>, init?: ContextInit): InitializedContext<T>;
  init<T extends {}, C>(context: ClassConstructor<CatContext<T, C>>, init: ContextInit & ContextInitConfig<C>): InitializedContext<T>;
  init(context: ClassConstructor<CatContext<any>>, init: ContextInit & Partial<ContextInitConfig<any>> = DEFAULT_INIT): InitializedContext<any> {
    const contextInstance = ContextManager.instantiateContext(context, init.key, init.config);

    const initializedContext = new InitializedContextImpl(contextInstance);

    this.setCachedInitializedContext(context, init.key, initializedContext);

    return initializedContext;
  }

  get(context: ClassConstructor<CatContext<any>>, key: any = DEFAULT_KEY): InitializedContext<any> {
    const initializedContext = this.getCachedInitializedContext(context, key);

    if (initializedContext) {
      return initializedContext;
    }

    throw ErrorBuilder.noInitializedContextFoundError(ContextManager.getContextMetadataOrThrow(context).contextName, key);
  }

  getOrInit<T extends {}>(context: ClassConstructor<CatContext<T>>, init?: ContextInit): InitializedContext<T>;
  getOrInit<T extends {}, C>(context: ClassConstructor<CatContext<T, C>>, init: ContextInit & ContextInitConfig<C>): InitializedContext<T>;
  getOrInit(context: ClassConstructor<CatContext<any>>, init: ContextInit & Partial<ContextInitConfig<any>> = DEFAULT_INIT): InitializedContext<any> {
    const initializedContext = this.getCachedInitializedContext(context, init.key);

    if (initializedContext) {
      return initializedContext;
    }

    return this.init(context, init);
  }

  destroy(context: ClassConstructor<CatContext<any>>, key: any = DEFAULT_KEY): void {
    ContextManager.disposeContext(context, key);
    this.instances.get(context)?.delete(key);

    if (this.instances.get(context)?.size === 0) {
      this.instances.delete(context);
    }
  }

  private setCachedInitializedContext(context: ClassConstructor<CatContext<any>>, key: any, initializedContext: InitializedContext<any>): void {
    const contextInstances = this.instances.get(context) ?? new Map();

    contextInstances.set(key, initializedContext);
    this.instances.set(context, contextInstances);
  }

  private getCachedInitializedContext(context: ClassConstructor<CatContext<any>>, key: any): InitializedContext<any> | null {
    const contextInstances = this.instances.get(context);

    if (!contextInstances) {
      return null;
    }

    return contextInstances.get(key) ?? null;
  }
}
