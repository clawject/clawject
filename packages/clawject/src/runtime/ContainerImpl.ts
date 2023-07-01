import { CatContext } from './CatContext';
import { ContextDelegate } from './ContextDelegate';
import { Context } from './Context';
import { Container, ContextInit, ContextInitConfig } from './Container';
import { ErrorBuilder } from './ErrorBuilder';
import { ClassConstructor } from './ClassConstructor';
import { Scope } from './scope/Scope';
import { ScopeRegister } from './scope/ScopeRegister';
import { RuntimeElement } from './runtime-elements/RuntimeElement';
import { ContextManager } from './internal/ContextManager';

const DEFAULT_KEY = undefined;

const DEFAULT_INIT: ContextInit = {
    key: DEFAULT_KEY,
};

export class ContainerImpl implements Container {
    init<T>(context: ClassConstructor<CatContext<T>>, init?: ContextInit): Context<T>;
    init<T, C>(context: ClassConstructor<CatContext<T, C>>, init: ContextInit & ContextInitConfig<C>): Context<T>;
    init(context: ClassConstructor<CatContext<any>>, init: ContextInit & Partial<ContextInitConfig<any>> = DEFAULT_INIT): Context<any> {
        const contextManager = this.getContextManagerOrThrow(context);
        const contextInstance = contextManager.instantiateContext(init.key, init.config);

        return new ContextDelegate(contextInstance, contextManager);
    }

    get(context: ClassConstructor<CatContext<any>>, key: any = DEFAULT_KEY): Context<any> {
        const contextManager = this.getContextManagerOrThrow(context);
        const contextInstance = contextManager.getInstanceOrThrow(key);

        return new ContextDelegate(contextInstance, contextManager);
    }

    getOrInit<T>(context: ClassConstructor<CatContext<T>>, init?: ContextInit): Context<T>;
    getOrInit<T, C>(context: ClassConstructor<CatContext<T, C>>, init: ContextInit & ContextInitConfig<C>): Context<T>;
    getOrInit(context: ClassConstructor<CatContext<any>>, init: ContextInit & Partial<ContextInitConfig<any>> = DEFAULT_INIT): Context<any> {
        const contextManager = this.getContextManagerOrThrow(context);
        const contextInstance = contextManager.getInstanceOrInstantiate(init.key, init.config);

        return new ContextDelegate(contextInstance, contextManager);
    }

    clear<T>(context: ClassConstructor<CatContext<T>>, key: any = DEFAULT_KEY): void {
        const contextManager = this.getContextManagerOrThrow(context);

        contextManager.dispose(key);
    }

    registerScope(scopeName: string, scope: Scope): void {
        ScopeRegister.registerScope(scopeName, scope);
    }

    private getContextManagerOrThrow(context: ClassConstructor<any>): ContextManager {
        if (!(context.prototype instanceof CatContext)) {
            throw ErrorBuilder.classNotInheritorOfCatContext();
        }

        const contextManager = context[RuntimeElement.CONTEXT_MANAGER] as ContextManager | undefined;

        if (!contextManager) {
            throw ErrorBuilder.usageWithoutConfiguredDI();
        }

        return contextManager;
    }
}
