import { ErrorBuilder } from './ErrorBuilder';

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
export abstract class CatContext<T = {}, C = null> {
    constructor() {
        throw ErrorBuilder.usageWithoutConfiguredDI('CatContext.constructor');
    }

    /**
     * Returns config that was passed in context initialization stage via {@link Container#initContext} or {@link Container#getOrInitContext}.
     * */
    protected get config(): C {
        throw ErrorBuilder.usageWithoutConfiguredDI('CatContext.config');
    }
}
