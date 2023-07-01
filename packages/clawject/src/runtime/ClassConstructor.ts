export type ClassConstructor<T, A extends any[] = []> = { new (...args: A): T };
