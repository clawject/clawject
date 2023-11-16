import { Bean, CatContext, PostConstruct } from 'clawject';

class MyContext extends CatContext {
  @Bean myCollection = new Set(['foo', 'bar', 'baz']);
  @Bean string1 = 'quux';
  @Bean string2 = 'quuux';

  @PostConstruct
  postConstruct(
    myCollection: Set<string>, // myCollection bean will be injected
    otherStrings: Set<string>, // Set of string1 and string2 beans will be injected
  ): void {
    console.log(this.myCollection);
  }
}
