import { Bean, CatContext, PostConstruct } from '@clawject/di';
import typia from 'typia';

interface A {
  str: string | number;
  num: number;
}

const isFunction = typia.protobuf.message<bigint>();

class MyContext extends CatContext {
  @Bean
  get number(): number {
    return 123;
  }

  @PostConstruct
  postConstruct(
    // data: string,
    data2: number
  ): void {
  }
}

console.log(123);
