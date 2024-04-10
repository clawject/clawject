export const mapSetToArray = <T, R>(set: Set<T>, mapFn: (value: T) => R): R[] => {
  const result: R[] = [];

  for (const value of set) {
    result.push(mapFn(value));
  }

  return result;
};
