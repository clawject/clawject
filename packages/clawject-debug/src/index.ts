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

@Configuration
class Test {
  data(arg: string): number
  @Bean data(arg: any): any {
    return arg;
  }

  @Bean
  init(data: string): number {
    console.log('init');

    return 1;
  }
}

@ClawjectApplication
export class Application {
  @Bean test() {
    return Promise.resolve();
  }

  exported2 = ExportBeans<{ a: any }>();
}

const app = await ClawjectFactory.createApplicationContext(Application);
const data = app.getExportedBean('a');
