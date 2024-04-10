import { matchFlag } from './matchFlag';

interface ITSFlagsEnumerable {
  [index: string]: string | number;
}

const FLAGS_CACHE = new Map<ITSFlagsEnumerable, number[]>();

export function parseFlags<T extends ITSFlagsEnumerable>(enumObj: T, flags: number): T[keyof T][] {
  const allFlags = FLAGS_CACHE.get(enumObj) ?? [];

  if (allFlags.length === 0) {
    Object.keys(enumObj).forEach((k) => {
      const value = enumObj[k];

      if (typeof value === 'number') {
        allFlags.push(value);
      }
    });

    FLAGS_CACHE.set(enumObj, allFlags);
  }

  const matchedFlags = allFlags.filter((flag) => matchFlag(flag, flags));

  return matchedFlags.filter((f, i) => matchedFlags.indexOf(f) === i) as T[keyof T][];

  // return matchedFlags
  //     .filter((f, i) => matchedFlags.indexOf(f) === i)
  //     .map((f) => {
  //         const power = Math.log2(f);
  //         if (Number.isInteger(power)) {
  //             return `${enumObj[f]} (2 ^ ${power})`;
  //         }
  //         return enumObj[f];
  //     });
}
