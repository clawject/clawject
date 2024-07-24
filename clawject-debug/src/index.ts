import { Bean, ClawjectApplication, ClawjectFactory, Configuration, ExposeBeans, External, Import, Internal } from "@clawject/di";

@Configuration
class Foo {
  @Bean bar = 123
}

@ClawjectApplication
class Application {
  @External foo = Import(Foo)
}

(async() => {
  const application = await ClawjectFactory.createApplicationContext(Application);
})()
