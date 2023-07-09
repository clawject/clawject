import { ClassConstructor } from '../ClassConstructor';

export function Configuration<T>(target: ClassConstructor<T>, context: any);
/**
 * Legacy decorators
 * */
export function Configuration<T extends Function>(target: T): T | void;
export function Configuration() {
  throw new Error('TODO');
}
