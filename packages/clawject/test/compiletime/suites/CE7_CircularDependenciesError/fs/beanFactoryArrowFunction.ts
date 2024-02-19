import { Bean, ClawjectApplication } from '@clawject/di';

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

@ClawjectApplication
export class Application {
  @Bean a = (b: B, c: C, d: D, e: E, f: F) => new A(b, c, d, e, f);
  @Bean b = (a: A, c: C, d: D, e: E, f: F) => new B(a, c, d, e, f);
  @Bean c = (a: A, b: B, d: D, e: E, f: F) => new C(a, b, d, e, f);
  @Bean d = (a: A, b: B, c: C, e: E, f: F) => new D(a, b, c, e, f);
  @Bean e = (a: A, b: B, c: C, d: D, f: F) => new E(a, b, c, d, f);
  @Bean f = (a: A, b: B, c: C, d: D, e: E) => new F(a, b, c, d, e);
}
