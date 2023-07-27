import { ContextManager } from '../___internal___/ContextManager';
import { RuntimeComponentMetadata } from './RuntimeComponentMetadata';

export enum StaticRuntimeElement {
  CONTEXT_MANAGER = 'clawject_context_manager',
  COMPONENT_METADATA = 'clawject_component_metadata',
  //TODO move from here because it's not runtime
}

export interface StaticRuntimeElementsTypeMap extends Record<StaticRuntimeElement, unknown> {
  [StaticRuntimeElement.CONTEXT_MANAGER]: ContextManager;
  [StaticRuntimeElement.COMPONENT_METADATA]: RuntimeComponentMetadata;
}
