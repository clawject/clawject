import {Bean, ClawjectApplication, PostConstruct} from '@clawject/di';

@ClawjectApplication
class App {
  @Bean a: A<string | number> = {} as any;

  @PostConstruct
  pc(test: B<string>) {

  }
}

interface B<T> {}
interface A<T> extends B<T> {}
