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
  @Bean a(b: B, c: C, d: D, e: E, f: F) {return new A(b, c, d, e, f); }
  @Bean b(a: A, c: C, d: D, e: E, f: F) {return new B(a, c, d, e, f); }
  @Bean c(a: A, b: B, d: D, e: E, f: F) {return new C(a, b, d, e, f); }
  @Bean d(a: A, b: B, c: C, e: E, f: F) {return new D(a, b, c, e, f); }
  @Bean e(a: A, b: B, c: C, d: D, f: F) {return new E(a, b, c, d, f); }
  @Bean f(a: A, b: B, c: C, d: D, e: E) {return new F(a, b, c, d, e); }
}
