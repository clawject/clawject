import { Bean, CatContext } from 'clawject';

class A {
  constructor(b: B, c: C, d: D, e: E, f: F) {}
}

class B {
  constructor(a: A, c: C, d: D, e: E, f: F) {}
}

class C {
  constructor(a: A, b: B, d: D, e: E, f: F) {}
}

class D {
  constructor(a: A, b: B, c: C, e: E, f: F) {}
}

class E {
  constructor(a: A, b: B, c: C, d: D, f: F) {}
}

class F {
  constructor(a: A, b: B, c: C, d: D, e: E) {}
}

export class MyContext extends CatContext {
  a = Bean(A);
  b = Bean(B);
  c = Bean(C);
  d = Bean(D);
  e = Bean(E);
  f = Bean(F);
}
