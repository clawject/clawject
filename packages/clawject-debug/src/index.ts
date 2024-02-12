import {Bean, ClawjectApplication, PostConstruct} from '@clawject/di';

interface Test<T> {}

@ClawjectApplication
class Application {
  @Bean strOrNumber = {} as Test<string | number>;

  @PostConstruct
  postConstruct(str: Test<string | number>) {
    console.log('PostConstruct');
  }
}
