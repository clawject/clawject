import { RuntimeElementFactories } from './RuntimeElementFactories';

export enum InstanceRuntimeElement {
  CONTEXT_ELEMENT_FACTORIES = 'clawject_element_factories',
  CONTEXT_TYPE = 'clawject_context_type',
}

export interface InstanceRuntimeElementsTypeMap extends Record<InstanceRuntimeElement, unknown> {
  [InstanceRuntimeElement.CONTEXT_ELEMENT_FACTORIES]: RuntimeElementFactories;
  [InstanceRuntimeElement.CONTEXT_TYPE]: null;
}
