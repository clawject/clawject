export const compact = <T>(array: Array<T | null | undefined | false | '' | 0 | 0n>): T[] =>
  array.filter((it): it is T => !!it);
