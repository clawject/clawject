export enum InstanceRuntimeElement {
  CONTEXT_TYPE = 'clawject_context_type',
  CONFIGURATION_INIT = 'clawject_configuration_init',
}

export interface InstanceRuntimeElementsTypeMap extends Record<InstanceRuntimeElement, unknown> {
  [InstanceRuntimeElement.CONTEXT_TYPE]: null;
  [InstanceRuntimeElement.CONFIGURATION_INIT]: () => void;
}
