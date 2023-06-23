import { Configuration, Autowired, runClawjectApplication, Bean } from 'clawject';

@Configuration
export class TestContext {
    property: string = Autowired();

    @Bean a123 = '';
}

runClawjectApplication();
