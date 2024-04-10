export const filterAndMap = <T, F extends T, M>(
  array: T[],
  filterFn: ((value: T, index: number) => value is F) | ((value: T, index: number) => boolean),
  mapfn: (value: F, index: number) => M,
): M[] => {
  const resultList: M[] = [];

  for (let i = 0; i < array.length; i++) {
    const element = array[i];

    filterFn(element, i) && resultList.push(mapfn(element as any, i));
  }

  return resultList;
};
