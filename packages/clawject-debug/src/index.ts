import {Bean, ClawjectApplication, Configuration, Import, PostConstruct} from '@clawject/di';

@Configuration
class C {
  imported = Import(Application);

  @PostConstruct
  pc(_2: 2) {

  }
}

@ClawjectApplication
export class Application {
  imported = Import(C);

  @Bean _2 = 2 as const;

  @PostConstruct
  pc(_1: 1) {

  }
}
