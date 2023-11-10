import { CatContext } from 'clawject';

export type ClawjectMethodDecorator = <This extends CatContext<any, any>, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) => (this: This, ...args: Args) => Return;
export type ClawjectFieldDecorator = <This extends CatContext<any, any>, Value extends any>(
  target: undefined,
  context: ClassFieldDecoratorContext<This, Value>
) => (this: This, value: Value) => Value;
export type DecoratorWithoutArguments<T> = T & ((this: void) => T);

const Bean: DecoratorWithoutArguments<ClawjectMethodDecorator> & DecoratorWithoutArguments<ClawjectFieldDecorator> = undefined as any;

class MyContext extends CatContext {

  @Bean() method = 123;
}
