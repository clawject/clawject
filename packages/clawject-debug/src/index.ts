import {Bean, BeforeDestruct, CatContext, Container, PostConstruct} from 'clawject';

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

    myClass = Bean(MyClass);
}

Container.init(MyContext);
Container.clear(MyContext);
