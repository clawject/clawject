import { Bean, ClawjectApplication, ClawjectFactory, PostConstruct } from "@clawject/di";

type C<T> = { a: T }
type B<T> = { b: T }
interface A<T> extends B<C<T>> {
  a: B<T>;
}

@ClawjectApplication
class App {
  @Bean bean = {} as A<123>;

  @PostConstruct
  init(
    //Can't resolve type in nested generics
    bean: B<C<123>>,
  ) {}
}

ClawjectFactory.createApplicationContext(App)
