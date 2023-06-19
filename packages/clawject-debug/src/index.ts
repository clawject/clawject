import { Configuration, Autowired } from 'clawject';

@Configuration
export class TestContext {
    property: string = Autowired();
}
