import { Bean, ClawjectApplication, ClawjectFactory, Configuration, Embedded, ExposeBeans, Import, Lazy } from '@clawject/di';

@Configuration
class Conf {}

@ClawjectApplication
class Application {
  @Bean dataa= 123;

  imp = Import(Conf);
}

const application = await ClawjectFactory.createApplicationContext(Application);
