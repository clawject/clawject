import {Bean, ClawjectApplication, Embedded, PostConstruct} from '@clawject/di';

@ClawjectApplication
class App {
  @Bean a: T1 = {} as any;

  @PostConstruct
  pc(test: T2) {

  }
}

type T1 = {}
type T2 = {}
