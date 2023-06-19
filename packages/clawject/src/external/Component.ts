import { ClassConstructor } from './ClassConstructor';

export function Component<T>(target: ClassConstructor<T>, context: any);
/**
 * Legacy decorators
 * */
export function Component<T extends Function>(target: T): T | void;
export function Component() {
    throw new Error('TODO');
}
