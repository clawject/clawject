import { Bean } from "@clawject/di";

console.log('FooConfiguration declared');

export class FooConfiguration {
  constructor() {
    console.log('FooConfiguration constructor');
  }

  foo = Bean(42).external();
}
