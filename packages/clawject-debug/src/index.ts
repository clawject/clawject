import {Bean, ClawjectApplication, Configuration, Imports} from '@clawject/di';

@Configuration
export class _3<T> {
  @Bean data(dep: T): T {}
}

@Configuration
export class _2<T> {
  @Imports imports = {_3: _3<T>};
}

@ClawjectApplication
export class _1 {
  @Imports imports = {_2: _2<string>};

  @Bean root = 42;
}
