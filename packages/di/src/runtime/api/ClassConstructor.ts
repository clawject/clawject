/**
 * @internalApi Just a utility type.
 *
 *  @public
 */
export type ClassConstructor<T, A extends any[] = any[]> = { new(...args: A): T };
