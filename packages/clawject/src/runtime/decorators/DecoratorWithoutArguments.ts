/**
 * Type declaration for a decorator without arguments.
 *
 * @public
 */
export type DecoratorWithoutArguments<T> = T & ((this: void) => T);
