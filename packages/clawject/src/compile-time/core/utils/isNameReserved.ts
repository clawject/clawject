import { CompileTimeElement } from '../declaration-metadata/CompileTimeElement';

const reservedNames = new Set<string>(
  [
    ...Array.from(Object.values(CompileTimeElement)),
  ]
);

export const isNameReserved = (name: string): boolean => reservedNames.has(name);
