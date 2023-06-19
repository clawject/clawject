import { Configuration, Autowired, runClawjectApplication } from 'clawject';

@Configuration
export class TestContext {
    property: string = Autowired();
}

runClawjectApplication();
