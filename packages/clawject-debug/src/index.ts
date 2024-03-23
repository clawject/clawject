import { Bean, ClawjectApplication, ClawjectFactory, Configuration, Embedded, ExposeBeans, Import, Lazy } from '@clawject/di';

@Configuration
class Conf {}

@ClawjectApplication
class Application {
  @Lazy(false) imp = Import(Conf);
}

const application = await ClawjectFactory.createApplicationContext(Application);
