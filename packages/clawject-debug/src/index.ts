import {
  Bean,
  CatContext,
  ContainerManager,
  CustomScope,
  ObjectFactory,
  ObjectFactoryResult,
  PostConstruct,
  Scope,
  ScopeRegister
} from '@clawject/di';

class MyContext extends CatContext {
  @Bean str = 'abc';
}

ContainerManager.init(MyContext);
