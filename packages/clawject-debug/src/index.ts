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

@ClawjectApplication
export class Application {
  @Bean test() {
    return {} as Promise<void>;
  }

  exported2 = ExportBeans<{ a: any }>();
}

const app = await ClawjectFactory.createApplicationContext(Application);
const data = app.getExportedBean('a');
