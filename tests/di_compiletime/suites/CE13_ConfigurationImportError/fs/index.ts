import { ClawjectApplication, Configuration, Import } from '@clawject/di';

@Configuration
class BarConfiguration {
  nonExistingConfiguration = Import(NonExistingConfiguration);
}

@ClawjectApplication
class Application {
  nonExistingConfiguration = Import(NonExistingConfiguration);
  bar = Import(BarConfiguration);
}
