import { Bean, CatContext } from 'clawject';

// @Configuration
// export class TestContext {
//     property: string = Autowired();
//
//     @Bean a123 = '';
// }

// runClawjectApplication();

interface IMyContext {
    myBean: string;
}

class MyClass {
    constructor(
        myBean: string,
    ) {
    }
}

class MyContext extends CatContext<IMyContext> {
    @Bean myBean = 'myBean' as const;

    myClass = Bean(MyClass);
}
