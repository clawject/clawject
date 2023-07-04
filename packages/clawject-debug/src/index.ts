import { Bean, BeforeDestruct, CatContext, ContainerManager, Scope, PostConstruct, Lazy } from 'clawject';

class MyClass {
    @PostConstruct
    postConstruct(): void {
        console.log('class postConstruct');
    }

    @BeforeDestruct
    beforeDestruct(): void {
        console.log('class beforeDestruct');
    }
}

class MyContext extends CatContext {
    @PostConstruct
    postConstruct(
        myClass1: MyClass,
    ) {
        console.log('context postConstruct');
    }

    @BeforeDestruct
    beforeDestruct() {
        console.log('context beforeDestruct');
    }

    @Scope('singleton')
    @Lazy(true)
        myClass = Bean(MyClass);
}

ContainerManager.init(MyContext);
ContainerManager.clear(MyContext);

