import { RuntimeElementFactories } from './RuntimeElementFactories';

export enum InstanceRuntimeElement {
  CONTEXT_ELEMENT_FACTORIES = 'clawject_element_factories',
  CONTEXT_TYPE = 'clawject_context_type',
  CONFIGURATION_INIT = 'clawject_configuration_init',
  COMPONENT_INIT = 'clawject_component_init',
}

export interface InstanceRuntimeElementsTypeMap extends Record<InstanceRuntimeElement, unknown> {
  [InstanceRuntimeElement.CONTEXT_ELEMENT_FACTORIES]: RuntimeElementFactories;
  [InstanceRuntimeElement.CONTEXT_TYPE]: null;
  [InstanceRuntimeElement.CONFIGURATION_INIT]: () => void;
  [InstanceRuntimeElement.COMPONENT_INIT]: () => void;
}
