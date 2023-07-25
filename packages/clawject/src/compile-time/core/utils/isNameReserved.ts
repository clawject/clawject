import { StaticRuntimeElement } from '../../../runtime/runtime-elements/StaticRuntimeElement';
import { InstanceRuntimeElement } from '../../../runtime/runtime-elements/InstanceRuntimeElement';

const reservedNames = new Set<string>(
  [
    ...Array.from(Object.values(StaticRuntimeElement)),
    ...Array.from(Object.values(InstanceRuntimeElement)),
  ]
);

export const isNameReserved = (name: string): boolean => reservedNames.has(name);
