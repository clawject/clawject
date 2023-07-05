import { Bean, BeforeDestruct, CatContext, ContainerManager, Scope, PostConstruct, Lazy, Embedded } from 'clawject';

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

interface MyEmbedded {
    foo: string;
    bar: number;
}

class A<T> {
    declare data: T;
}

type MyType = Array<string>

class MyContext extends CatContext {
    @Bean str1 = 'str1';
    @Bean str2 = 'str2';

    @PostConstruct
    postConstruct(
        any: MyType,
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

ContainerManager.clear(MyContext);

