import {Bean, ClawjectApplication, ClawjectFactory, ExportBeans, Qualifier} from '@clawject/di';

@ClawjectApplication
export class _1 {
  @Bean @Qualifier('Test') asd = new Map<string, number>([['a', 1]]);

  @Bean number = 1 as const;

  exported = ExportBeans<{ Test: 1 }>();
}

const claw = await ClawjectFactory.createApplicationContext(_1);

const beans = await claw.getExportedBeans();

console.log(beans);

await claw.destroy();
