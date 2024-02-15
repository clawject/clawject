/** @public */
export type InstantiationConstructorParameters<A extends any[]> = A | (() => A | Promise<A>);
