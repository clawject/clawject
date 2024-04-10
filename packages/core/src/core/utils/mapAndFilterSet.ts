export const mapAndFilterSet = <T, U, S extends U>(
  set: Set<T>,
  mapfn: (value: T) => U,
  filterFn: (value: U) => value is S
): Set<S> => {
  const resultSet = new Set<S>();

  for (const element of set) {
    const mapped = mapfn(element);

    if (filterFn(mapped)) {
      resultSet.add(mapped);
    }
  }

  return resultSet;
};
