import { Bean, CatContext, ContainerManager, Embedded, Lazy, PostConstruct } from 'clawject';
import { TestClass } from './TestClass';

interface IEmbedded {
  abc: string;
  def: string;
}

class MyContext extends CatContext {
  @Embedded @Bean embedded: IEmbedded = {
    abc: 'abc',
    def: 'def',
  };

  @Bean myCollection = new Set(['foo', 'bar', 'baz']);
  @Bean string1 = 'quux';
  @Bean string2 = 'quuux';
  testClass = Bean(TestClass);

  @PostConstruct
  postConstruct(
    set: Set<any>, // Set of string1 and string2 beans will be injected,
    map: Map<string, any>,
    array: any[],
    embeddedAbc: string,
  ): void {
    console.log('postConstruct', set, map, array, embeddedAbc);
  }
}

console.log(ContainerManager.init(MyContext));
