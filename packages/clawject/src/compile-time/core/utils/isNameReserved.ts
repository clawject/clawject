import { RuntimeElement } from '../../../runtime/runtime-elements/RuntimeElement';

const reservedNames = new Set<string>(Object.values(RuntimeElement));

export const isNameReserved = (name: string): boolean => reservedNames.has(name);
