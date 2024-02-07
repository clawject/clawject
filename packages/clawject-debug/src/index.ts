import {
  Bean,
  ClawjectApplication,
  ClawjectFactory,
  Configuration,
  Embedded,
  Import,
  PostConstruct,
  Scope
} from '@clawject/di';
import {type AsyncClass} from './AsyncClass';

const AnyClassImport = import('./AsyncClass');

interface A {
    data: string;
    data2: number;
}

@Configuration
class TestConfig {
  @Bean str = '';
}

@ClawjectApplication
export class _1 {
  testConfig = Import(Promise.resolve(TestConfig));

  @PostConstruct
  init(test: string): void {
    console.log('init,', test);
  }
}

const claw = await ClawjectFactory.createApplicationContext(_1);

await claw.destroy();
