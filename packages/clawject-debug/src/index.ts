import { Bean, BeforeDestruct, CatContext, ContainerManager, Scope, PostConstruct, Lazy, Embedded } from 'clawject';
import { IMyContext } from './IMyContext';
import { ClassWithDependencies } from './ClassWithDependencies';

class A {
    constructor(str: string) {
    }
}

interface IEmbedded {
    str: string;
}

class MyContext extends CatContext<IMyContext> {
    @Bean @Embedded embedded(): IEmbedded {
        return ({ str: 'str' });
    }

    @Bean string1 = 'string1';
    @Bean string2 = 'string2';

    a = Bean(A);
}

console.log(ContainerManager.init(MyContext).getBeans());

