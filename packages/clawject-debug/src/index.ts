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

@Configuration
class TestConfig {
  @Bean str = new Promise<string>(resolve => {
    setTimeout(() => resolve('Hello'), 2500);
  });
}

@ClawjectApplication
export class _1 {
  importedTestConfiguration = Import(new Promise<typeof TestConfig>(resolve => {
    setTimeout(() => resolve(TestConfig), 2500);
  }));

  @PostConstruct
  init(str: string): void {
    console.log('init,', str);
  }
}

const claw = await ClawjectFactory.createApplicationContext(_1);

await claw.destroy();
