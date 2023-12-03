import {Bean, CatContext, ContainerManager, PostConstruct} from '@clawject/di';

interface InterfaceThatExtends {}
interface InterfaceThatExtends2 extends InterfaceThatExtends {}

type Test = { a: string };

class ApplicationContext extends CatContext {
  @Bean interfaceThatExtends2: InterfaceThatExtends2 = {};
  @Bean interfaceThatExtends: InterfaceThatExtends = {};

  @PostConstruct
  init(
    aaa: string,
  ) {
    console.log('init');
  }
}

ContainerManager.init(ApplicationContext);
