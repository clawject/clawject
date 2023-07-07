import { Bean, PreDestroy, CatContext, ContainerManager, Scope, PostConstruct, Lazy, Embedded } from 'clawject';
import { IMyContext } from './IMyContext';

class A {
    constructor(str: string) {
    }
}

interface IEmbedded {
    str: string;
}

class MyContext extends CatContext<IMyContext> {
    @Bean expressionBean = 'str';

    @Bean methodBean(str: string, map: Map<string, any>): any {}
    @Bean arrowFunctionBean = (str: string): any => {};
    @Bean propertyBean = Bean(A);

    @PostConstruct @PreDestroy lifecycleMethod(str: string) {}
    @PostConstruct @PreDestroy lifecycleArrowFunction = (str: string) => {};
}

console.log(Array.from(ContainerManager.init(MyContext).getAllBeans()));
