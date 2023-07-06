export * from './runtime/decorators';

export { ContainerManager, ContextInit, ContextInitConfig } from './runtime/ContainerManager';
export { InitializedContext } from './runtime/InitializedContext';

export { CatContext } from './runtime/CatContext';

export { ObjectFactory, ObjectFactoryResult } from './runtime/object-factory/ObjectFactory';

export { CustomScope } from './runtime/scope/CustomScope';

export { ___TypeReferenceTable___ } from './runtime/___TypeReferenceTable___';

//Application mode only
// export { Configuration } from './external/Configuration';
// export { Autowired } from './external/Autowired';
// export { Component } from './external/Component';
// export { runClawjectApplication } from './external/runClawjectApplication';
