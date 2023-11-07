import { Bean, CatContext } from 'clawject';

export class MyContext extends CatContext {
  @Bean undefinedValueExpression: undefined = undefined;
  @Bean voidValueExpression: void = undefined;
  @Bean nullValueExpression: null = null;
  @Bean neverValueExpression: never = undefined as never;
  @Bean unionValueExpression: string | number = 'string';

  @Bean undefinedFactoryMethod(): undefined { return undefined; }
  @Bean voidFactoryMethod(): void { return undefined; }
  @Bean nullFactoryMethod(): null { return null; }
  @Bean neverFactoryMethod(): never { throw new Error('never'); }
  @Bean unionFactoryMethod(): string | number { return 'string'; }

  @Bean undefinedFactoryArrowFunction = (): undefined => { return undefined; };
  @Bean voidFactoryArrowFunction = (): void => { return undefined; };
  @Bean nullFactoryArrowFunction = (): null => { return null; };
  @Bean neverFactoryArrowFunction = (): never => { throw new Error('never'); };
  @Bean unionFactoryArrowFunction = (): string | number => { return 'string'; };
}
