export type Decorator<T> = T & ((this: void) => T);
