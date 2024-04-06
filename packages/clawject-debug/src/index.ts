import { Bean, ClawjectApplication, Configuration, Import, Internal } from '@clawject/di';

@Configuration
class AConfiguration {
  @Bean data = 42;
}
@Configuration
class BConfiguration {
  @Bean data = 42;
}

@ClawjectApplication
class Application {
  @Internal aConfiguartion = Import(AConfiguration);
  @Internal bConfiguartion = Import(BConfiguration);
}


