/** @public */
export type DecoratorWithoutArguments<T> = T & ((this: void) => T);
