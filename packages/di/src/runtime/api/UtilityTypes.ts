export type TypeHolder<T> = (v: T) => T;

export type Not<T extends boolean> = T extends true ? false : true;

export type OmitTuple<T extends readonly any[], U> = T extends [infer First, ...infer Rest]
  ? First extends U
    ? OmitTuple<Rest, U>
    : [First, ...OmitTuple<Rest, U>]
  : [];

export type BooleanLiteral<T extends boolean> = [T] extends [true]
  ? T
  : [T] extends [false]
  ? T
  : never;

export type StringLiteral<T extends string> = string extends T ? never : T;

export type NumberLiteral<T extends number> = number extends T ? never : T;

/**
 * @public
 */
export type PickFieldsWithType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

/**
 * @internalApi Just a utility type.
 *
 * @public
 */
export type FieldValues<T extends object> = T[keyof T];

/**
 * @internalApi Just a utility type.
 * @public
 */
export type MergedObjects<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
