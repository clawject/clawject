import {Bean, ClawjectApplication, ClawjectFactory, ExportBeans, ImportedConfiguration, Qualifier} from '@clawject/di';

@ClawjectApplication
export class _1 {
  @Bean @Qualifier('Test') asd = 2;

  @Bean number = 1 as const;

  exported = ExportBeans<{ allnums: number[] }>();
}

const claw = await ClawjectFactory.createApplicationContext(_1);

const beans = await claw.getExportedBeans();

console.log(beans);

await claw.destroy();
