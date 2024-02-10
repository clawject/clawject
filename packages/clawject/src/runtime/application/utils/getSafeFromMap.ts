export const EMPTY_TOKEN = Symbol();

export const getSafeFromMap = <K, V>(map: ReadonlyMap<K, V>, key: K): V | typeof EMPTY_TOKEN => {
  if (!map.has(key)) {
    return EMPTY_TOKEN;
  }

  return map.get(key)!;
};
