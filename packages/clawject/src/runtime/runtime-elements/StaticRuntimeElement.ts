import { RuntimeComponentMetadata } from './RuntimeComponentMetadata';
import { ContextMetadata } from '../___internal___/ContextManager';
import { getConstructorFromInstance } from '../utils/getConstructorFromInstance';
import { ClassConstructor } from '../ClassConstructor';

export enum StaticRuntimeElement {
  CONTEXT_METADATA = 'clawject_context_metadata',
  COMPONENT_METADATA = 'clawject_component_metadata',
}

export interface StaticRuntimeElementsTypeMap extends Record<StaticRuntimeElement, unknown> {
  [StaticRuntimeElement.CONTEXT_METADATA]: ContextMetadata;
  [StaticRuntimeElement.COMPONENT_METADATA]: RuntimeComponentMetadata;
}

export const getStaticRuntimeElementFromInstanceConstructor = <T extends StaticRuntimeElement>(instance: any, key: T): StaticRuntimeElementsTypeMap[T] | null => {
  const instanceConstructor = getConstructorFromInstance(instance);

  if (!instanceConstructor) {
    return null;
  }

  return instanceConstructor[key as any] ?? null;
};

export const getStaticRuntimeElementFromConstructor = <T extends StaticRuntimeElement>(constructor: ClassConstructor<any>, key: T): StaticRuntimeElementsTypeMap[T] | null => {
  return constructor[key as any] ?? null;
};
