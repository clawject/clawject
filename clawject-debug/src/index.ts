import { Bean, ClawjectApplication, ClawjectFactory, Configuration, ExposeBeans, Import } from "@clawject/di";

class Foo {
  static instantiationCount = 0;

  counter = Foo.instantiationCount++;

  constructor() {
    console.log('Foo instantiated');
    console.log(this.counter);
  }
}

@Configuration
class ToBeImported {
  foo = Bean(Foo);
}

@Configuration
class Bar {
  toBeImported = Import(ToBeImported);
}

@ClawjectApplication
class Application1 {
  toBeImported = Import(ToBeImported);
  bar = Import(Bar);

  exposed = ExposeBeans<{ foo: Foo }>();
}

@ClawjectApplication
class Application2 {
  bar = Import(Bar);
  toBeImported = Import(ToBeImported);

  exposed = ExposeBeans<{ foo: Foo }>();
}

(async() => {
  const application1 = await ClawjectFactory.createApplicationContext(Application1);
  const exposed1 = await application1.getExposedBeans();
  const application2 = await ClawjectFactory.createApplicationContext(Application2);
  const exposed2 = await application2.getExposedBeans();
})()
