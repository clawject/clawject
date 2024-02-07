import {
  Bean,
  ClawjectApplication,
  ClawjectFactory, Configuration,
  CustomScope, Embedded, Import,
  ObjectFactory,
  ObjectFactoryResult,
  PostConstruct,
  PreDestroy, Scope, ScopeRegister
} from '@clawject/di';

interface A {
  data: string;
  datanum: number;
}

class S {
}

@ClawjectApplication
export class _1 {
  s2 = Bean(S);

  @Bean str = '';

  @PostConstruct
  postConstruct(aData: string, s: S, s1: S): void {
    console.log(s === s1);
  }

  @PreDestroy
  preDestroy(data: string): void {
    console.trace('PreDestroy', data);
  }
}

const claw = await ClawjectFactory.createApplicationContext(_1);

await claw.destroy();
