import { Configuration, Autowired, runClawjectApplication, CatContext, Bean } from 'clawject';

@Configuration
export class TestContext {
    property: string = Autowired();
}

runClawjectApplication();

// class MyContext extends CatContext {
//     @Bean property: string = '';
// }
