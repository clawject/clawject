import {
  Bean,
  ClawjectApplication,
  ClawjectFactory,
  Configuration,
  ExportBeans,
  External,
  Import,
  Internal, PostConstruct, Primary
} from '@clawject/di';

class A {
  constructor(public someProperty: string) {
  }
}

interface IEmbedded {
  a: A;
}

@Configuration
@Internal
class Test {
  @Bean @Primary data = 'test';

  @Bean
  init(data: string): number {
    console.log('init');

    return 1;
  }
}

@ClawjectApplication
export class Application {
  test = Import(Test);

  @Bean data = 'test';

  exported = ExportBeans<{ a: string }>();
}

const app = await ClawjectFactory.createApplicationContext(Application);
