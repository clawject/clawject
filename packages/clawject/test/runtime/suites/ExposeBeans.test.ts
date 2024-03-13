import { Bean, ClawjectApplication, ClawjectFactory, Configuration, ExposeBeans, Import } from '@clawject/di';

describe('ExposeBeans', () => {
  it('should expose beans', async() => {
    //Given
    class A { static counter = 0; name = 'a'; generation = A.counter++ }
    class B { static counter = 0; name = 'b'; generation = B.counter++ }
    class C { static counter = 0; name = 'c'; generation = C.counter++ }

    interface Exposed {
      a: A;
      b: B;
      c: C;
    }

    @ClawjectApplication
    class Application {
      bean0 = Bean(A);
      bean1 = Bean(B);
      bean2 = Bean(C);

      exposed = ExposeBeans<Exposed>();
    }

    const application = await ClawjectFactory.createApplicationContext(Application);

    //When
    const actual = await application.getExposedBeans();

    //Then
    expect(actual).toEqual({
      a: { name: 'a', generation: 0 },
      b: { name: 'b', generation: 0 },
      c: { name: 'c', generation: 0 },
    });
  });

  it('should expose beans and combine exposed beans to one object', async() => {
    //Given
    class A { static counter = 0; name = 'a'; generation = A.counter++ }
    class B { static counter = 0; name = 'b'; generation = B.counter++ }
    class C { static counter = 0; name = 'c'; generation = C.counter++ }

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
      a: { name: 'a', generation: 0 },
      b: { name: 'b', generation: 0 },
      c: { name: 'c', generation: 0 },
    });
  });

  it('should expose beans from nested configurations', async() => {
    //Given
    class A { static counter = 0; name = 'a'; generation = A.counter++ }
    class B { static counter = 0; name = 'b'; generation = B.counter++ }
    class C { static counter = 0; name = 'c'; generation = C.counter++ }

    interface Exposed {
      a: A;
      b: B;
      c: C;
    }

    @Configuration
    class AConfiguration {
      a = Bean(A);
    }
    @Configuration
    class BConfiguration {
      b = Bean(B);
    }
    @Configuration
    class CConfiguration {
      c = Bean(C);
    }

    @ClawjectApplication
    class Application {
      aConfiguration = Import(AConfiguration);
      bConfiguration = Import(BConfiguration);
      cConfiguration = Import(CConfiguration);

      exposed = ExposeBeans<Exposed>();
    }

    const application = await ClawjectFactory.createApplicationContext(Application);

    //When
    const actual = await application.getExposedBeans();

    //Then
    expect(actual).toEqual({
      a: { name: 'a', generation: 0 },
      b: { name: 'b', generation: 0 },
      c: { name: 'c', generation: 0 },
    });
  });

  it('should expose collections of beans', async() => {
    //Given
    class A { static counter = 0; name = 'a'; generation = A.counter++ }
    class B { static counter = 0; name = 'b'; generation = B.counter++ }
    class C { static counter = 0; name = 'c'; generation = C.counter++ }

    interface Exposed {
      a: A[];
      b: Set<B>;
      c: Map<string, C>;
    }

    @ClawjectApplication
    class Application {
      a0 = Bean(A);
      a1 = Bean(A);
      a2 = Bean(A);
      b0 = Bean(B);
      b1 = Bean(B);
      b2 = Bean(B);
      c0 = Bean(C);
      c1 = Bean(C);
      c2 = Bean(C);

      exposed = ExposeBeans<Exposed>();
    }

    const application = await ClawjectFactory.createApplicationContext(Application);

    //When
    const actual = await application.getExposedBeans();

    //Then
    expect(actual).toEqual({
      a: [
        { name: 'a', generation: 0 },
        { name: 'a', generation: 1 },
        { name: 'a', generation: 2 },
      ],
      b: new Set([
        { name: 'b', generation: 0 },
        { name: 'b', generation: 1 },
        { name: 'b', generation: 2 },
      ]),
      c: new Map([
        ['c0', { name: 'c', generation: 0 }],
        ['c1', { name: 'c', generation: 1 }],
        ['c2', { name: 'c', generation: 2 }],
      ]),
    });
  });

  it('should expose beans when beans async', async() => {
    //Given
    class A { static counter = 0; name = 'a'; generation = A.counter++ }
    class B { static counter = 0; name = 'b'; generation = B.counter++ }
    class C { static counter = 0; name = 'c'; generation = C.counter++ }

    interface Exposed {
      a: A;
      b: B;
      c: C;
    }

    @ClawjectApplication
    class Application {
      bean0 = Bean(new Promise<typeof A>(resolve => {
        setTimeout(() => resolve(A), 100);
      }));
      bean1 = Bean(new Promise<typeof B>(resolve => {
        setTimeout(() => resolve(B), 200);
      }));
      bean2 = Bean(new Promise<typeof C>(resolve => {
        setTimeout(() => resolve(C), 300);
      }));

      exposed = ExposeBeans<Exposed>();
    }

    const application = await ClawjectFactory.createApplicationContext(Application);

    //When
    const actual = await application.getExposedBeans();

    //Then
    expect(actual).toEqual({
      a: { name: 'a', generation: 0 },
      b: { name: 'b', generation: 0 },
      c: { name: 'c', generation: 0 },
    });
  });
});
