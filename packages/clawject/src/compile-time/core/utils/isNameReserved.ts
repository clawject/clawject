import { StaticRuntimeElement } from '../../../runtime/runtime-elements/StaticRuntimeElement';
import { InstanceRuntimeElement } from '../../../runtime/runtime-elements/InstanceRuntimeElement';
import { CompileTimeElement } from '../compilation-metadata/CompileTimeElement';

const reservedNames = new Set<string>(
  [
    ...Array.from(Object.values(StaticRuntimeElement)),
    ...Array.from(Object.values(InstanceRuntimeElement)),
    ...Array.from(Object.values(CompileTimeElement)),
  ]
);

export const isNameReserved = (name: string): boolean => reservedNames.has(name);
