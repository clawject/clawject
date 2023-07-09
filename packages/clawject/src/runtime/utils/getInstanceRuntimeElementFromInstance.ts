import { InstanceRuntimeElement, InstanceRuntimeElementsTypeMap } from '../runtime-elements/InstanceRuntimeElement';

export const getInstanceRuntimeElementFromInstance = <T extends InstanceRuntimeElement>(instance: any, key: T): InstanceRuntimeElementsTypeMap[T] | null => {
  return instance[key] ?? null;
};
