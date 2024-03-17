import { Bean, ClawjectApplication, ClawjectFactory, Embedded, ExposeBeans, Lazy, PostConstruct, Scope } from '@clawject/di';

describe('Scope', () => {
  it('beans should be singleton and transient', async () => {
    //Given
    class Foo {
      static instantiationsCount = 0;

      instantiationCount: number;

      constructor() {
        this.instantiationCount = ++Foo.instantiationsCount;
      }
    }
    class Bar {
      static instantiationsCount = 0;

      instantiationCount: number;

      constructor() {
        this.instantiationCount = ++Bar.instantiationsCount;
      }
    }

    class DependencyHolder {
      constructor(
        public foo1: Foo,
        public foo2: Foo,
        public foo3: Foo,
        public bar1: Bar,
        public bar2: Bar,
        public bar3: Bar,
      ) {}
    }

    @ClawjectApplication
    class Application {
      @Scope('singleton') foo = Bean(Foo);
      @Scope('transient') bar = Bean(Bar);

      dependencyHolder = Bean(DependencyHolder);

      exposed = ExposeBeans<{
        foo: Foo,
        bar: Bar,
        dependencyHolder: DependencyHolder,
      }>();
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);

    //Then
    expect(Foo.instantiationsCount).toBe(1);
    expect(Bar.instantiationsCount).toBe(3);

    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    expect(dependencyHolder.foo1).toBe(dependencyHolder.foo2);
    expect(dependencyHolder.foo2).toBe(dependencyHolder.foo3);

    expect(dependencyHolder.bar1.instantiationCount).toBe(1);
    expect(dependencyHolder.bar2.instantiationCount).toBe(2);
    expect(dependencyHolder.bar3.instantiationCount).toBe(3);

    expect(dependencyHolder.bar1).not.toBe(dependencyHolder.bar2);
    expect(dependencyHolder.bar2).not.toBe(dependencyHolder.bar3);

    expect(Bar.instantiationsCount).toBe(3);

    const bar1 = await application.getExposedBean('bar');
    const bar2 = await application.getExposedBean('bar');

    expect(bar1.instantiationCount).toBe(4);
    expect(bar2.instantiationCount).toBe(5);
  });
});
