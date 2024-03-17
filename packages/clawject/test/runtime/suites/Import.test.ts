import { Bean, ClawjectApplication, ClawjectFactory, Configuration, ExposeBeans, Import, PostConstruct, PreDestroy } from '@clawject/di';

describe('Import', () => {
  it('should Import configurations', async () => {
    //Given
    class Foo {}
    @Configuration
    class FooConfiguration {
      foo = Bean(Foo);
    }

    class Bar {}
    @Configuration
    class BarConfiguration {
      fooConfiguration = Import(FooConfiguration);

      bar = Bean(Bar);
    }

    @ClawjectApplication
    class Application {
      barConfiguration = Import(BarConfiguration);

      exposed = ExposeBeans<{ foo: Foo; bar: Bar }>();
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const exposed = await application.getExposedBeans();

    //Then
    expect(exposed.foo).toBeInstanceOf(Foo);
    expect(exposed.bar).toBeInstanceOf(Bar);
  });

  it('should Import configurations when it is async', async () => {
    //Given
    class Foo {}
    @Configuration
    class FooConfiguration {
      foo = Bean(Foo);
    }

    class Bar {}
    @Configuration
    class BarConfiguration {
      fooConfiguration = Import(Promise.resolve(FooConfiguration));

      bar = Bean(Bar);
    }

    @ClawjectApplication
    class Application {
      barConfiguration = Import(Promise.resolve(BarConfiguration));

      exposed = ExposeBeans<{ foo: Foo; bar: Bar }>();
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const exposed = await application.getExposedBeans();

    //Then
    expect(exposed.foo).toBeInstanceOf(Foo);
    expect(exposed.bar).toBeInstanceOf(Bar);
  });

  it('should Import configurations when it is async and have constructor arguments with different type', async () => {
    //Given
    class Foo {}
    @Configuration
    class FooConfiguration {
      constructor(
        private fooValue: string
      ) {}

      foo = Bean(Foo);
    }

    class Bar {}
    @Configuration
    class BarConfiguration {
      constructor(
        private barValue: number
      ) {}

      fooConfiguration = Import(Promise.resolve(FooConfiguration), ['fooValue']);

      bar = Bean(Bar);
    }

    class Baz {}
    @Configuration
    class BazConfiguration {
      constructor(
        private bazValue: boolean
      ) {}

      barConfiguration = Import(Promise.resolve(BarConfiguration), () => [42] as const);

      baz = Bean(Baz);
    }

    @ClawjectApplication
    class Application {
      bazConfiguration = Import(Promise.resolve(BazConfiguration), async() => [false] as const);

      exposed = ExposeBeans<{ foo: Foo; bar: Bar; baz: Baz }>();
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const exposed = await application.getExposedBeans();

    //Then
    expect(exposed.foo).toBeInstanceOf(Foo);
    expect(exposed.bar).toBeInstanceOf(Bar);
    expect(exposed.baz).toBeInstanceOf(Baz);
  });

  it('should not instantiate imported configuration more than once', async () => {
    //Given
    class Foo {
      static instantiationCount = 0;

      constructor() {
        Foo.instantiationCount++;
      }
    }
    @Configuration
    class FooConfiguration {
      static instantiationCount = 0;

      constructor() {
        FooConfiguration.instantiationCount++;
      }

      foo = Bean(Foo);
    }

    class Bar {
      static instantiationCount = 0;

      constructor() {
        Bar.instantiationCount++;
      }
    }
    @Configuration
    class BarConfiguration {
      static instantiationCount = 0;

      constructor() {
        BarConfiguration.instantiationCount++;
      }

      fooConfiguration0 = Import(FooConfiguration);
      fooConfiguration1 = Import(FooConfiguration);
      fooConfiguration2 = Import(Promise.resolve(FooConfiguration));
      fooConfiguration3 = Import(Promise.resolve(FooConfiguration));

      bar = Bean(Bar);
    }

    @ClawjectApplication
    class Application {
      barConfiguration0 = Import(BarConfiguration);
      barConfiguration1 = Import(BarConfiguration);
      barConfiguration2 = Import(Promise.resolve(BarConfiguration));
      barConfiguration3 = Import(Promise.resolve(BarConfiguration));

      exposed = ExposeBeans<{ foo: Foo; bar: Bar }>();
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const exposed = await application.getExposedBeans();

    //Then
    expect(exposed.foo).toBeInstanceOf(Foo);
    expect(exposed.bar).toBeInstanceOf(Bar);
    expect(Foo.instantiationCount).toBe(1);
    expect(FooConfiguration.instantiationCount).toBe(1);
    expect(Bar.instantiationCount).toBe(1);
    expect(BarConfiguration.instantiationCount).toBe(1);
  });

  it('should Import Applications', async () => {
    //Given
    class Foo {}
    @ClawjectApplication
    class FooApplication {
      foo = Bean(Foo);
    }

    class Bar {}
    @ClawjectApplication
    class BarApplication {
      fooApplication = Import(FooApplication);

      bar = Bean(Bar);
    }

    @ClawjectApplication
    class Application {
      barApplication = Import(BarApplication);

      exposed = ExposeBeans<{ foo: Foo; bar: Bar }>();
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const exposed = await application.getExposedBeans();

    //Then
    expect(exposed.foo).toBeInstanceOf(Foo);
    expect(exposed.bar).toBeInstanceOf(Bar);
  });
});
