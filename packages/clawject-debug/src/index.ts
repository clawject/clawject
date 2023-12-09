import {Bean, CatContext, ContainerManager, PostConstruct} from '@clawject/di';

interface Foo {foo: string}
type Bar = Foo & {bar: string};

class ApplicationContext extends CatContext {
  @Bean test: [string, number] = ['test', 1];

  @PostConstruct
  postConstruct(
    a: [string, any],
  ): void {

  }
}

ContainerManager.init(ApplicationContext);
