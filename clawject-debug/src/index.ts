import { Bean, ClawjectApplication, ClawjectFactory, PostConstruct } from "@clawject/di";

interface C<T> { a: T }
interface B<T> { b: T }
interface A<T> extends B<C<T>> {
  a: B<T>;
}

@ClawjectApplication
class App {
  @Bean bean = { a: { b: 123 }, b: { a: 123 } } as A<123>;

  @PostConstruct
  init(
    //Can't resolve type in nested generics
    bean: C<B<number>>,
  ) {}
}

ClawjectFactory.createApplicationContext(App)
