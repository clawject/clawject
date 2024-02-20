export const filterSet = <T>(set: Set<T>, predicate: (value: T) => boolean): Set<T> => {
  const filteredSet = new Set<T>();

  for (const value of set) {
    if (predicate(value)) {
      filteredSet.add(value);
    }
  }

  return filteredSet;
};
