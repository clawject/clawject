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

class A {
  constructor(
    data: string,
    nul: null,
    undef: undefined,
    voi: void,
  ) {
  }
}

ContainerManager.init(MyContext);
