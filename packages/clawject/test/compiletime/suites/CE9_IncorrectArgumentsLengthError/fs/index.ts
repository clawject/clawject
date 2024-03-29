import { Bean, ClawjectApplication, Embedded, Lazy, PostConstruct, PreDestroy, Primary, Qualifier, Scope } from '@clawject/di';

@ClawjectApplication
class Application1 {
  @Bean(1) a1 = 42;
  @Bean(1, 2) a2 = 42;
  @Bean(1, 2, 3) a3 = 42;

  @PostConstruct(1) b1() {}
  @PostConstruct(1, 2) b2() {}
  @PostConstruct(1, 2, 3) b3() {}

  @PreDestroy(1) c1() {}
  @PreDestroy(1, 2) c2() {}
  @PreDestroy(1, 2, 3) c3() {}

  @Bean @Embedded(1) d1 = 42;
  @Bean @Embedded(1, 2) d2 = 42;
  @Bean @Embedded(1, 2, 3) d3 = 42;

  @Bean @Lazy(true, false) e2 = 42;
  @Bean @Lazy(true, false, true) e3 = 42;

  @Bean @Scope('1', '2') f2 = 42;
  @Bean @Scope('1', '2', '3') f3 = 42;

  @Bean @Primary(1) g1 = 42;
  @Bean @Primary(1, 2) g2 = 42;
  @Bean @Primary(1, 2, 3) g3 = 42;

  @Bean @Qualifier('1', '2') h2 = 42;
  @Bean @Qualifier('1', '2', '3') h3 = 42;
}

@Lazy(true, false)
@ClawjectApplication
class Application1 {}

@Lazy(true, false, true)
@ClawjectApplication
class Application1 {}

@Scope('1', '2')
@ClawjectApplication
class Application1 {}

@Scope('1', '2', '3')
@ClawjectApplication
class Application1 {}
