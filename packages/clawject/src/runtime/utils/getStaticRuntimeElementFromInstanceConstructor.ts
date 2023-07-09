import { getConstructorFromInstance } from './getConstructorFromInstance';
import { StaticRuntimeElement, StaticRuntimeElementsTypeMap } from '../runtime-elements/StaticRuntimeElement';

export const getStaticRuntimeElementFromInstanceConstructor = <T extends StaticRuntimeElement>(instance: any, key: T): StaticRuntimeElementsTypeMap[T] | null => {
  const instanceConstructor = getConstructorFromInstance(instance);

  if (!instanceConstructor) {
    return null;
  }

  return instanceConstructor[key as any] ?? null;
};
