export * from './runtime/decorators';
export * from './runtime/errors';

export { ContainerManager, type ContextInit, type ContextInitConfig } from './runtime/ContainerManager';
export type { InitializedContext } from './runtime/InitializedContext';
export type { ClassConstructor } from './runtime/ClassConstructor';

export { CatContext } from './runtime/CatContext';

export type { ObjectFactory, ObjectFactoryResult } from './runtime/object-factory/ObjectFactory';

export { CustomScope } from './runtime/scope/CustomScope';

export { ___TypeReferenceTable___ } from './runtime/___TypeReferenceTable___';

//Application mode only
// export { Configuration } from './external/Configuration';
// export { Autowired } from './external/Autowired';
// export { Component } from './external/Component';
// export { runClawjectApplication } from './external/runClawjectApplication';
