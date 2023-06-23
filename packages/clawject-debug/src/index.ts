import { CatContext, Bean } from 'clawject';

// @Configuration
// export class TestContext {
//     property: string = Autowired();
//
//     @Bean a123 = '';
// }

// runClawjectApplication();

interface IMyContext {
    myBeann: string;
}

class MyContext extends CatContext<IMyContext> {
    @Bean
        myBean = 'myBean';

    myClass = Bean(MyClass);
}

class MyClass {
    constructor(
        myBean: string,
        myb: number,
    ) {}
}
