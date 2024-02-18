import {Bean, ClawjectApplication, PostConstruct} from '@clawject/di';

interface IFoo { foo: string }
interface IBar { bar: string }

@ClawjectApplication
class Application {
  @Bean bar: IBar = { bar: 'barValue' };
  @Bean foo: IFoo = { foo: 'fooValue' };

  @PostConstruct
  postConstruct(
    dep0: IFoo | IBar, // <- "bar" will be injected here, because it was registered as a bean before 'foo'
  ) {}
}
