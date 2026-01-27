import { Bean } from "@clawject/di";

interface IFoo {
  n: number;
}

class Foo implements IFoo {
  n = 42;
  b = Bean(function() { return new Foo() })
}
const sym = Symbol();

type Configuration<T> = {
  readonly [sym]: void;
  readonly clazz: T;
};

function Configuration<T>(c: T): Configuration<T> {
  return {
    [sym]: undefined,
    clazz: c
  }
}


export const FooConfiguration = Configuration(Foo);
