import { RuntimeElementFactories } from './RuntimeElementFactories';

export enum InstanceRuntimeElement {
  CONTEXT_ELEMENT_FACTORIES = 'clawject_element_factories'
}

export interface InstanceRuntimeElementsTypeMap extends Record<InstanceRuntimeElement, unknown> {
  [InstanceRuntimeElement.CONTEXT_ELEMENT_FACTORIES]: RuntimeElementFactories;
}
