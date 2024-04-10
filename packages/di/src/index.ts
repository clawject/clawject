export * from './runtime/api/decorators';
export * from './runtime/api/RuntimeErrors';

export type { ClassConstructor } from './runtime/api/ClassConstructor';
export { ScopeRegister } from './runtime/api/ScopeRegister';

export { Import, type ImportedConfiguration } from './runtime/api/Import';
export { ExposeBeans, type ExposedBeans } from './runtime/api/ExposeBeans';

export type { ObjectFactory, ObjectFactoryResult } from './runtime/api/ObjectFactory';

export { Scope, ScopeValue, ScopeTarget } from './runtime/api/Scope';

export type { ClawjectApplicationContext, MergedObjects, GetBeansResult, PickFieldsWithType, FieldValues } from './runtime/api/ClawjectApplicationContext';
export type { InstantiationConstructorParameters } from './runtime/api/InstantiationConstructorParameters';
export { ClawjectFactory } from './runtime/api/ClawjectFactory';

// Internal api section
export type { BeanMetadata } from './runtime/api/BeanMetadata';
export type { BeanProcessor, BeanProcessorFactoryMetadata } from './runtime/api/BeanProcessor';

export type { ___TypeReferenceTable___ } from './runtime/api/___TypeReferenceTable___';
