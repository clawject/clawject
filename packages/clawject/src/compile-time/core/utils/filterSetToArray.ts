export const filterSetToArray = <T>(set: Set<T>, predicate: (value: T) => boolean): T[] => {
  const filtered: T[] = [];

  for (const value of set) {
    if (predicate(value)) {
      filtered.push(value);
    }
  }

  return filtered;
};
