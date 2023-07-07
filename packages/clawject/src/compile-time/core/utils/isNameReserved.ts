import { StaticRuntimeElement } from '../../../runtime/runtime-elements/StaticRuntimeElement';

const reservedNames = new Set<string>(Object.values(StaticRuntimeElement));

export const isNameReserved = (name: string): boolean => reservedNames.has(name);
