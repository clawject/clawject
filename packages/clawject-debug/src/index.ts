import { Bean, BeforeDestruct, CatContext, ContainerManager, PostConstruct } from 'clawject';

class MyClass {
    @PostConstruct
    postConstruct(): void {
        console.log('class postConstruct');
    }

    @BeforeDestruct
    beforeDestruct(): void {
        console.log('class beforeDestruct');
    }

    @PostConstruct
    @BeforeDestruct
    postConstructAndBeforeDestruct(): void {
        console.log('class postConstructAndBeforeDestruct');
    }
}

class MyContext extends CatContext {
    @PostConstruct
    postConstruct() {
        console.log('context postConstruct');
    }

    @BeforeDestruct
    beforeDestruct() {
        console.log('context beforeDestruct');
    }

    @PostConstruct
    @BeforeDestruct
    postConstructAndBeforeDestruct(): void {
        console.log('context postConstructAndBeforeDestruct');
    }

    myClass = Bean(MyClass);
}

ContainerManager.init(MyContext);
ContainerManager.clear(MyContext);
