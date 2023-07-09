import { StaticRuntimeElement } from './StaticRuntimeElement';
import { RuntimeElementFactories } from './RuntimeElementFactories';

export enum InstanceRuntimeElement {
  CONTEXT_ELEMENT_FACTORIES = 'clawject_element_factories'
}

export interface InstanceRuntimeElementsTypeMap extends Record<InstanceRuntimeElement, unknown> {
  [StaticRuntimeElement.CONTEXT_MANAGER]: RuntimeElementFactories;
}
