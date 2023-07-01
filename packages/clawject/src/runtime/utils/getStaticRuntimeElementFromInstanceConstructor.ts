import { getConstructorFromInstance } from './getConstructorFromInstance';
import { RuntimeElement, RuntimeElementsTypeMap } from '../runtime-elements/RuntimeElement';

export const getStaticRuntimeElementFromInstanceConstructor = <T extends RuntimeElement>(instance: any, key: T): RuntimeElementsTypeMap[T] | null => {
    const instanceConstructor = getConstructorFromInstance(instance);

    if (!instanceConstructor) {
        return null;
    }

    return instanceConstructor[key as any] ?? null;
};
