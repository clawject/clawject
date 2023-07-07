import { ContextManager } from '../internal/ContextManager';
import { RuntimeComponentMetadata } from './RuntimeComponentMetadata';

export enum StaticRuntimeElement {
    CONTEXT_MANAGER = 'clawject_context_manager', // static
    COMPONENT_METADATA = 'clawject_component_metadata', // static
    CONTEXT_TYPE = 'clawject_context_type', // will be static
}

export interface StaticRuntimeElementsTypeMap extends Record<StaticRuntimeElement, unknown> {
    [StaticRuntimeElement.CONTEXT_MANAGER]: ContextManager;
    [StaticRuntimeElement.COMPONENT_METADATA]: RuntimeComponentMetadata;
    [StaticRuntimeElement.CONTEXT_TYPE]: null;
}
