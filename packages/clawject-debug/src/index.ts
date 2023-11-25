import { Bean, CatContext, ContainerManager, CustomScope, ObjectFactory, ObjectFactoryResult, PostConstruct, Scope, ScopeRegister } from '@clawject/di';

class A {
}

class MyContext extends CatContext {
    @Scope('custom') value = Bean(A);

    @PostConstruct
    postConstruct(
      value: any
    ) {
      console.log(value);
    }
}

class MyScope implements CustomScope {
  get(name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    console.log('name', name);
    return objectFactory.getObject();
  }

  registerDestructionCallback(name: string, callback: () => void): void {
  }

  remove(name: string): ObjectFactoryResult | null {
    return null;
  }

  useProxy(): boolean {
    return false;
  }
}

ScopeRegister.registerScope('custom', new MyScope());

ContainerManager.init(MyContext);
