import { Bean, ClawjectApplication } from '@clawject/di';

@ClawjectApplication
export class Application {
  @Bean undefinedValueExpression: undefined = undefined;
  @Bean voidValueExpression: void = undefined;
  @Bean nullValueExpression: null = null;
  @Bean neverValueExpression: never = undefined as never;

  @Bean undefinedFactoryMethod(): undefined { return undefined; }
  @Bean voidFactoryMethod(): void { return undefined; }
  @Bean nullFactoryMethod(): null { return null; }
  @Bean neverFactoryMethod(): never { throw new Error('never'); }

  @Bean undefinedFactoryArrowFunction = (): undefined => { return undefined; };
  @Bean voidFactoryArrowFunction = (): void => { return undefined; };
  @Bean nullFactoryArrowFunction = (): null => { return null; };
  @Bean neverFactoryArrowFunction = (): never => { throw new Error('never'); };
}
