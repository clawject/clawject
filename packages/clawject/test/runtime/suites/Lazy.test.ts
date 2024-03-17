import { Bean, ClawjectApplication, ClawjectFactory, Embedded, ExposeBeans, Lazy } from '@clawject/di';

describe('Lazy', () => {
  it('should lazily instantiate beans', async () => {
    //Given
    class Foo {
      static instantiationCount = 0;

      constructor() {
        Foo.instantiationCount++;
      }
    }

    @ClawjectApplication
    class Application {
      fooEager = Bean(Foo);
      @Lazy(false) fooEagerExplicit = Bean(Foo);

      @Lazy fooLazy = Bean(Foo);

      exposed = ExposeBeans<{
        fooEager: Foo,
        fooEagerExplicit: Foo,
        fooLazy: Foo
      }>();
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);

    //Then
    expect(Foo.instantiationCount).toBe(2);

    const exposed = await application.getExposedBeans();

    expect(exposed.fooEager).toBeInstanceOf(Foo);
    expect(exposed.fooEagerExplicit).toBeInstanceOf(Foo);
    expect(exposed.fooLazy).toBeInstanceOf(Foo);

    expect(Foo.instantiationCount).toBe(3);
  });

  it('should lazily instantiate beans when put on application class', async () => {
    //Given
    class Foo {
      static instantiationCount = 0;

      constructor() {
        Foo.instantiationCount++;
      }
    }

    @ClawjectApplication
    @Lazy
    class Application {
      fooLazy = Bean(Foo);
      @Lazy(false) fooEager = Bean(Foo);

      exposed = ExposeBeans<{
        fooLazy: Foo,
        fooEager: Foo
      }>();
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);

    //Then
    expect(Foo.instantiationCount).toBe(1);

    const exposed = await application.getExposedBeans();

    expect(exposed.fooLazy).toBeInstanceOf(Foo);
    expect(exposed.fooEager).toBeInstanceOf(Foo);

    expect(Foo.instantiationCount).toBe(2);
  });
});
