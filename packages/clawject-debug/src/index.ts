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

interface Interface<T> extends ParentParent<T> {
  b: T;
}

class ParentParent<T> implements Interface<T> {
  b: T = 1 as any;
}

class ClassParent<T, NULL = null> extends ParentParent<T> implements Interface<T> {
  constructor(
    data: T,
    nul: NULL,
    undef: undefined,
    voi: void,
  ) {
    super();
  }
}

class Base<DATA, NULL = null> extends ClassParent<DATA, NULL> implements Interface<DATA>  {
  override b = 1 as any;
}

class MyContext extends CatContext {
  @Bean str = '';
  base = Bean(Base<string>);

  @PostConstruct
  postConstruct(
    sssssss: Map<string, any>,
  ): void {
    console.log('postConstruct');
  }
}

ContainerManager.init(MyContext);
