import { Bean, ClawjectApplication, ClawjectFactory, ExposeBeans } from '@clawject/di';

describe('ClawjectApplicationContext', () => {
  it('should get all exposed beans', async() => {
    //Given
    class A { static counter = 0; name = 'a'; instantiation = A.counter++; }
    class B { static counter = 0; name = 'b'; instantiation = B.counter++; }
    class C { static counter = 0; name = 'c'; instantiation = C.counter++; }

    interface Exposed0 {
      a: A;
      b: B;
    }
    interface Exposed1 {
      c: C;
    }

    @ClawjectApplication
    class Application {
      bean0 = Bean(A);
      bean1 = Bean(B);
      bean2 = Bean(C);

      exposed0 = ExposeBeans<Exposed0>();
      exposed1 = ExposeBeans<Exposed1>();
    }

    const application = await ClawjectFactory.createApplicationContext(Application);

    //When
    const actual = await application.getExposedBeans();

    //Then
    expect(actual).toEqual({
      a: { name: 'a', instantiation: 0 },
      b: { name: 'b', instantiation: 0 },
      c: { name: 'c', instantiation: 0 },
    });
  });

  it('should get exposed beans by name', async() => {
    //Given
    class A { static counter = 0; name = 'a'; instantiation = A.counter++; }
    class B { static counter = 0; name = 'b'; instantiation = B.counter++; }
    class C { static counter = 0; name = 'c'; instantiation = C.counter++; }

    interface Exposed0 {
      a: A;
      b: B;
    }
    interface Exposed1 {
      c: C;
    }

    @ClawjectApplication
    class Application {
      bean0 = Bean(A);
      bean1 = Bean(B);
      bean2 = Bean(C);

      exposed0 = ExposeBeans<Exposed0>();
      exposed1 = ExposeBeans<Exposed1>();
    }

    const application = await ClawjectFactory.createApplicationContext(Application);

    //When
    const a = await application.getExposedBean('a');
    const b = await application.getExposedBean('b');
    const c = await application.getExposedBean('c');

    //Then
    expect(a).toEqual({ name: 'a', instantiation: 0 });
    expect(b).toEqual({ name: 'b', instantiation: 0 });
    expect(c).toEqual({ name: 'c', instantiation: 0 });
  });
});
