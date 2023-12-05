import {Bean, CatContext} from '@clawject/di';

const constUniqueSymbol = Symbol.for('sym');

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

class ApplicationContext extends CatContext {
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

  @Bean symProperty = Symbol('symProperty');
  @Bean symFactoryMethod() { return Symbol('symFactoryMethod'); }
  @Bean symFactoryArrowFunction = () => Symbol('symFactoryArrowFunction');
  @Bean sym = Symbol('sym');
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
}
