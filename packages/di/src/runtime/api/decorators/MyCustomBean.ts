import { DecoratorWithoutArguments, ModernClassFieldDecorator } from './DecoratorTypes';
import { ClawjectDecorator } from './ClawjectDecorator';

export type MyCustomBeanTarget = PropertyDecorator & ModernClassFieldDecorator;

export const MyCustomBean: DecoratorWithoutArguments<MyCustomBeanTarget> & ClawjectDecorator<'MyCustomBean'> = () => {
  throw new Error('Not implemented');
};
