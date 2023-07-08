import { Bean, PreDestroy, CatContext, ContainerManager, Scope, PostConstruct, Lazy, Embedded } from 'clawject';
import { IMyContext } from './IMyContext';

class A implements IA {
    constructor() {
    }
}

interface IA {}

class MyContext extends CatContext<IMyContext> {
    @Bean a = new A();

    @PostConstruct
    postConstruct(abc: IA) {

    }
}

console.log(Array.from(ContainerManager.init(MyContext).getAllBeans()));

class Bar {
    constructor(
        private foo: Foo,
    ) {}
}

class Foo {
    constructor(
        private bar: Bar,
    ) {}
}

class MyContext2 extends CatContext {
    foo = Bean(Foo);
    bar = Bean(Bar);
}
