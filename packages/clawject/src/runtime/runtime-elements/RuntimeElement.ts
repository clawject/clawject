import { ContextManager } from '../internal/ContextManager';
import { RuntimeComponentMetadata } from './RuntimeComponentMetadata';

export enum RuntimeElement {
    CONTEXT_MANAGER = 'clawject_context_manager',
    COMPONENT_METADATA = 'clawject_component_metadata',
}

export interface RuntimeElementsTypeMap extends Record<RuntimeElement, unknown> {
    [RuntimeElement.CONTEXT_MANAGER]: ContextManager;
    [RuntimeElement.COMPONENT_METADATA]: RuntimeComponentMetadata;
}
