export enum RuntimeElement {
    METADATA = 'clawject_metadata',
    POST_CONSTRUCT = 'clawject_postConstruct',
    BEFORE_DESTRUCT = 'clawject_beforeDestruct',
    INIT = 'clawject_init',
    SINGLETON_MAP = 'clawject_singletonMap',
    CONFIG = 'clawject_config',
    CAT_CONTEXT_CONFIG = 'config',
    CAT_CONTEXT_CONTEXT = 'context',
    GET_BEAN = 'clawject_getBean',
    GET_BEANS = 'clawject_getBeans',
    GET_ALL_BEANS = 'clawject_getAllBeans',
    GET_PRIVATE_BEAN = 'clawject_getPrivateBean',
    CREATE_SET = 'clawject_createSet',
    CREATE_MAP = 'clawject_createMap',
}

const reservedRuntimeNamesForContext = new Set(Object.keys(RuntimeElement));
const reservedRuntimeNamesForComponent = new Set(
    Object.keys(RuntimeElement).filter(it => it !== RuntimeElement.CAT_CONTEXT_CONFIG && it !== RuntimeElement.CAT_CONTEXT_CONTEXT)
);

export const isReservedRuntimeNameForContext = (name: string): boolean => reservedRuntimeNamesForContext.has(name);
export const isReservedRuntimeNameForComponent = (name: string): boolean => reservedRuntimeNamesForComponent.has(name);
