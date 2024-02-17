import {Bean, ClawjectApplication, Embedded, PostConstruct} from '@clawject/di';

@ClawjectApplication
class App {
  @Bean @Embedded a: A & B = {} as any;

  @PostConstruct
  pc(test: A & C) {

  }
}

interface A { nested: C }
interface B { nested: D }

interface C {}
interface D {}
