import {Bean, ClawjectApplication, ClawjectFactory, Configuration, Embedded, PostConstruct, Scope} from '@clawject/di';

const AnyClassImport = import('./AsyncClass');

interface A {
    data: string;
    data2: number;
}

@ClawjectApplication
export class _1 {
  @Bean str = Promise.resolve('test');

  @PostConstruct
  init(test: string): void {
    console.log('init,', test);
  }
}

const claw = await ClawjectFactory.createApplicationContext(_1);

await claw.destroy();
