import { ClawjectApplication, Bean } from '@clawject/di';

class ClassWithMissingDependency {
  constructor(
    num: number,
    sym: symbol,
    str0: string,
  ) {}
}

class ClassWithMultipleInjectionCandidates {
  constructor(
    str: string
  ) {}
}

@ClawjectApplication
class Application {
  @Bean str0 = 'str0';
  @Bean str1 = 'str1';

  classWithMissingDependency = Bean(ClassWithMissingDependency);
  classWithMultipleInjectionCandidates = Bean(ClassWithMultipleInjectionCandidates);
}
