import { Bean, CatContext } from 'clawject';

export class MyContext extends CatContext {
  @Bean undefined: undefined = undefined;
  @Bean void: void = undefined;
  @Bean null: null = null;
  @Bean never(): never { throw new Error('never'); }
  @Bean union: string | number = 'string';
}
