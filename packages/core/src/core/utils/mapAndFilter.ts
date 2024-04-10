export const mapAndFilter = <T, U, S extends U>(
  array: T[],
  mapfn: (value: T, index: number, array: T[]) => U,
  filterFn: (value: U, index: number, array: U[]) => value is S
): S[] => {
  const resultList: S[] = [];

  for (let i = 0; i < array.length; i++) {
    const mapped = mapfn(array[i], i, array);

    filterFn(mapped, i, resultList) && resultList.push(mapped);
  }

  return resultList;
};
