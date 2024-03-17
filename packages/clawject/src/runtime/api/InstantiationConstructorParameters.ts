/**
 * Just a utility type.
 *
 * @public
 */
export type InstantiationConstructorParameters<A extends readonly any[]> = A | (() => A | Promise<A>);
