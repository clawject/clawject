import { BeanDefinition } from './BeanDefinition';
import { BeanDefinitionImpl } from './BeanDefinitionImpl';

/**
 * Indicates that a method/property produces/contains a bean or a bean constructor
 * to be managed by the Clawject container.
 *
 * @docs https://clawject.com/docs/fundamentals/bean
 *
 * @public
 */
export const Bean = <T>(value: T): BeanDefinition<T> => {
  return new BeanDefinitionImpl(value);
};
