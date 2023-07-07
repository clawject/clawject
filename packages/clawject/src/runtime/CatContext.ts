import { ErrorBuilder } from './ErrorBuilder';
import { getStaticRuntimeElementFromInstanceConstructor } from './utils/getStaticRuntimeElementFromInstanceConstructor';
import { StaticRuntimeElement } from './runtime-elements/StaticRuntimeElement';
import { ContextManager } from './internal/ContextManager';

/**
 * It's a class you should extend from to declare your own context.
 *
 * T is a plain map of beans that will be accessible via {@link Context#getBean} or {@link Context#getBeans}.
 *
 * C is a config type this will be passed in context initialization stage.
 *
 * @example Declaring your own context with some beans inside and starting service:
 * class MyRepository {
 *     readData(): string {
 *         // ...
 *     }
 * }
 *
 * class MyService {
 *     constructor(
 *         private repository: MyRepository
 *     ) {}
 *
 *     start(): void {
 *         // ...
 *     }
 * }
 *
 * class MyContext extends CatContext {
 *   @PostConstruct
 *   postConstruct(myService: MyService): void {
 *       myService.start();
 *   }
 *
 *   myRepository = Bean(MyRepository);
 *   myService = Bean(MyService);
 * }
 *
 * @see {@link Bean}
 * @see {@link PostConstruct}
 */
export abstract class CatContext<T = {}, C = undefined> {
    /**
     * Returns config that was passed in context initialization stage via {@link Container#initContext} or {@link Container#getOrInitContext}.
     * */
    protected get config(): C {
        return ContextManager.getConfigForInstance(this);
    }

    /**
     * Needed to type ContainerManager init/get methods.
     * Accessing this property will always throw an error.
     * */
    protected get clawject_context_type(): T {
        throw ErrorBuilder.illegalAccess('CatContext.clawject_context_type');
    }
}
