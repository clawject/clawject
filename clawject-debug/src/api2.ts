import { Bean, ClawjectApplication, Import } from "@clawject/di";

const dep = Bean;
const application = ClawjectApplication;

class Foo {
  constructor() {
    console.log('Foo constructor');
  }

  foo(): void {

  }
}

export class MyConfiguration {
  _ = application();
  foo = dep(Foo).lazy();

  test = class A {
    num = dep(42).external();
  }
}

const myConfig = new MyConfiguration();
export const a = new myConfig.test
