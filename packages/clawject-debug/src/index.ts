import {Bean, CatContext, ContainerManager, PostConstruct} from '@clawject/di';

interface Foo {foo: string}
type Bar = Foo & {bar: string};

class ApplicationContext extends CatContext {
  /* Type of Bean resolved to `Foo` */
  @Bean foo: Foo = {foo: ''};
  /* Type of Bean resolved to `Foo` */
  @Bean bar: Bar = {foo: '', bar: ''};
}

ContainerManager.init(ApplicationContext);
