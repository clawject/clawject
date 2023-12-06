import {Bean, CatContext, PostConstruct} from '@clawject/di';

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
  @PostConstruct
  postConstruct(
    b: Record<string, any>,
  ) {
    console.log('postConstruct');
  }
}
