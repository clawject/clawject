import { MaybePromise } from '../types/MaybePromise';

/**
 * Just a utility type.
 *
 * @public
 */
export type InstantiationConstructorParameters<A extends any[]> = A | (() => MaybePromise<A>);
