export const mapSet = <T, R>(set: Set<T>, mapFn: (value: T) => R): Set<R> => {
  const result = new Set<R>();

  for (const value of set) {
    result.add(mapFn(value));
  }

  return result;
};
