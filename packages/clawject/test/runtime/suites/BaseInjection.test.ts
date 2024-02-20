import { Bean, ClawjectApplication, ClawjectFactory, ExposeBeans } from '@clawject/di';

describe('BaseInjection', () => {

  const symProperty = Symbol('symProperty');
  const symFactoryMethod = Symbol('symFactoryMethod');
  const symFactoryArrowFunction = Symbol('symFactoryArrowFunction');
  const sym = Symbol('sym');
  const constUniqueSymbol = Symbol.for('uniqueSymbol');

  class Foo {}
  class Bar {
    constructor(
      public str: string,
      public num: number,
      public bigInt: bigint,
      public foo: Foo,
      public sym: symbol,
      public uniqueSymbol: typeof constUniqueSymbol,
    ) {}
  }

  it('test', async() => {
    //Given
    @ClawjectApplication
    class ApplicationContext {
      @Bean strProperty = 'strProperty';
      @Bean strFactoryMethod()  {return 'strFactoryMethod';}
      @Bean strFactoryArrowFunction = () => 'strFactoryArrowFunction';
      @Bean str = 'str';

      @Bean numProperty = 1;
      @Bean numFactoryMethod()  {return 2;}
      @Bean numFactoryArrowFunction = () => 3;
      @Bean num = 4;

      @Bean bigIntProperty = 1n;
      @Bean bigIntFactoryMethod()  {return 2n;}
      @Bean bigIntFactoryArrowFunction = () => 3n;
      @Bean bigInt = 4n;

      @Bean fooProperty = new Foo();
      @Bean fooFactoryMethod() { return new Foo(); }
      @Bean fooFactoryArrowFunction = () => new Foo();
      foo = Bean(Foo);

      @Bean symProperty: typeof symProperty = symProperty;
      @Bean symFactoryMethod(): typeof symFactoryMethod { return symFactoryMethod; }
      @Bean symFactoryArrowFunction = (): typeof symFactoryArrowFunction => symFactoryArrowFunction;
      @Bean sym: typeof sym = sym;
      @Bean uniqueSymbol: typeof constUniqueSymbol = constUniqueSymbol;

      @Bean barProperty = new Bar(
        this.strProperty,
        this.numProperty,
        this.bigIntProperty,
        this.fooProperty,
        this.symProperty,
        this.uniqueSymbol,
      );
      @Bean barFactoryMethod(
        strFactoryMethod: string,
        numFactoryMethod: number,
        bigIntFactoryMethod: bigint,
        fooFactoryMethod: Foo,
        symFactoryMethod: symbol,
        uniqueSymbol: typeof constUniqueSymbol,
      ) {
        return new Bar(
          strFactoryMethod,
          numFactoryMethod,
          bigIntFactoryMethod,
          fooFactoryMethod,
          symFactoryMethod,
          uniqueSymbol,
        );
      }
      @Bean barFactoryArrowFunction = (
        strFactoryArrowFunction: string,
        numFactoryArrowFunction: number,
        bigIntFactoryArrowFunction: bigint,
        fooFactoryArrowFunction: Foo,
        symFactoryArrowFunction: symbol,
        uniqueSymbol: typeof constUniqueSymbol,
      ) => new Bar(
        strFactoryArrowFunction,
        numFactoryArrowFunction,
        bigIntFactoryArrowFunction,
        fooFactoryArrowFunction,
        symFactoryArrowFunction,
        uniqueSymbol,
      );
      bar = Bean(Bar);

      exposed = ExposeBeans<{
        strProperty: string;
        strFactoryMethod: string;
        strFactoryArrowFunction: string;
        str: string;
        numProperty: number;
        numFactoryMethod: number;
        numFactoryArrowFunction: number;
        num: number;
        bigIntProperty: bigint;
        bigIntFactoryMethod: bigint;
        bigIntFactoryArrowFunction: bigint;
        bigInt: bigint;
        fooProperty: Foo;
        fooFactoryMethod: Foo;
        fooFactoryArrowFunction: Foo;
        foo: Foo;
        symProperty: typeof symProperty;
        symFactoryMethod: typeof symFactoryMethod;
        symFactoryArrowFunction: typeof symFactoryArrowFunction;
        sym: typeof sym;
        uniqueSymbol: typeof constUniqueSymbol;
        barProperty: Bar;
        barFactoryMethod: Bar;
        barFactoryArrowFunction: Bar;
        bar: Bar;
      }>();
    }

    //When
    const applicationContext = await ClawjectFactory.createApplicationContext(ApplicationContext);

    //Then
    const allBeans = new Map<string, any>(Object.entries(await applicationContext.getExposedBeans()));

    expect(allBeans.get('strProperty')).toBe('strProperty');
    expect(allBeans.get('strFactoryMethod')).toBe('strFactoryMethod');
    expect(allBeans.get('strFactoryArrowFunction')).toBe('strFactoryArrowFunction');
    expect(allBeans.get('str')).toBe('str');

    expect(allBeans.get('numProperty')).toBe(1);
    expect(allBeans.get('numFactoryMethod')).toBe(2);
    expect(allBeans.get('numFactoryArrowFunction')).toBe(3);
    expect(allBeans.get('num')).toBe(4);

    expect(allBeans.get('bigIntProperty')).toBe(1n);
    expect(allBeans.get('bigIntFactoryMethod')).toBe(2n);
    expect(allBeans.get('bigIntFactoryArrowFunction')).toBe(3n);
    expect(allBeans.get('bigInt')).toBe(4n);

    expect(allBeans.get('symProperty')).toBe(symProperty);
    expect(allBeans.get('symFactoryMethod')).toBe(symFactoryMethod);
    expect(allBeans.get('symFactoryArrowFunction')).toBe(symFactoryArrowFunction);
    expect(allBeans.get('sym')).toBe(sym);
    expect(allBeans.get('uniqueSymbol')).toBe(constUniqueSymbol);

    expect(allBeans.get('fooProperty')).toBeInstanceOf(Foo);
    expect(allBeans.get('fooFactoryMethod')).toBeInstanceOf(Foo);
    expect(allBeans.get('fooFactoryArrowFunction')).toBeInstanceOf(Foo);
    expect(allBeans.get('foo')).toBeInstanceOf(Foo);

    expect(allBeans.get('barProperty')).toBeInstanceOf(Bar);
    expect(allBeans.get('barProperty').str).toBe(allBeans.get('strProperty'));
    expect(allBeans.get('barProperty').num).toBe(allBeans.get('numProperty'));
    expect(allBeans.get('barProperty').bigInt).toBe(allBeans.get('bigIntProperty'));
    expect(allBeans.get('barProperty').foo).toBe(allBeans.get('fooProperty'));
    expect(allBeans.get('barProperty').sym).toBe(allBeans.get('symProperty'));
    expect(allBeans.get('barProperty').uniqueSymbol).toBe(allBeans.get('uniqueSymbol'));

    expect(allBeans.get('barFactoryMethod')).toBeInstanceOf(Bar);
    expect(allBeans.get('barFactoryMethod').str).toBe(allBeans.get('strFactoryMethod'));
    expect(allBeans.get('barFactoryMethod').num).toBe(allBeans.get('numFactoryMethod'));
    expect(allBeans.get('barFactoryMethod').bigInt).toBe(allBeans.get('bigIntFactoryMethod'));
    expect(allBeans.get('barFactoryMethod').foo).toBe(allBeans.get('fooFactoryMethod'));
    expect(allBeans.get('barFactoryMethod').sym).toBe(allBeans.get('symFactoryMethod'));
    expect(allBeans.get('barFactoryMethod').uniqueSymbol).toBe(allBeans.get('uniqueSymbol'));

    expect(allBeans.get('barFactoryArrowFunction')).toBeInstanceOf(Bar);
    expect(allBeans.get('barFactoryArrowFunction').str).toBe(allBeans.get('strFactoryArrowFunction'));
    expect(allBeans.get('barFactoryArrowFunction').num).toBe(allBeans.get('numFactoryArrowFunction'));
    expect(allBeans.get('barFactoryArrowFunction').bigInt).toBe(allBeans.get('bigIntFactoryArrowFunction'));
    expect(allBeans.get('barFactoryArrowFunction').foo).toBe(allBeans.get('fooFactoryArrowFunction'));
    expect(allBeans.get('barFactoryArrowFunction').sym).toBe(allBeans.get('symFactoryArrowFunction'));
    expect(allBeans.get('barFactoryArrowFunction').uniqueSymbol).toBe(allBeans.get('uniqueSymbol'));

    expect(allBeans.get('bar')).toBeInstanceOf(Bar);
    expect(allBeans.get('bar').str).toBe(allBeans.get('str'));
    expect(allBeans.get('bar').num).toBe(allBeans.get('num'));
    expect(allBeans.get('bar').bigInt).toBe(allBeans.get('bigInt'));
    expect(allBeans.get('bar').foo).toBe(allBeans.get('foo'));
    expect(allBeans.get('bar').sym).toBe(allBeans.get('sym'));
    expect(allBeans.get('bar').uniqueSymbol).toBe(allBeans.get('uniqueSymbol'));
  });
});
