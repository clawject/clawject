import { ContextManager } from '../internal/ContextManager';
import { RuntimeComponentMetadata } from './RuntimeComponentMetadata';

export enum RuntimeElement {
    CONTEXT_MANAGER = 'clawject_context_manager',
    COMPONENT_METADATA = 'clawject_component_metadata',
    CONTEXT_TYPE = 'clawject_context_type',
}

export interface RuntimeElementsTypeMap extends Record<RuntimeElement, unknown> {
    [RuntimeElement.CONTEXT_MANAGER]: ContextManager;
    [RuntimeElement.COMPONENT_METADATA]: RuntimeComponentMetadata;
    [RuntimeElement.CONTEXT_TYPE]: null;
}
