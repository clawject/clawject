import {Bean, ClawjectApplication, Configuration, Import, Internal, PostConstruct} from '@clawject/di';

@Configuration
class _2 {
  @Bean data = 2 as const;

  @PostConstruct
  asdsadc(a: 0) {
  }
}

@Configuration
class _1 {
  @Bean data1 = 1 as const;
  @Internal importedConfiguration_2 = Import(_2);
}

@ClawjectApplication
export class Application {
  importedConfiguration_1 = Import(_1);
  @Bean data = 0 as const;

  @PostConstruct
  postConstruct_0(arg2: 0) {
  }
}
