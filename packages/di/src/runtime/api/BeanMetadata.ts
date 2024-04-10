import { ClassConstructor } from './ClassConstructor';

/**
 *  @internalApi Changes to it will not be considered a breaking change in terms of semantic versioning.
 *
 *  @public
 *  */
export interface BeanMetadata {
  readonly parentConfigurationClassConstructor: ClassConstructor<any>;
  readonly parentConfigurationInstance: object;
  readonly name: string;
  readonly classPropertyName: string;
  readonly scope: string | number;
  readonly resolvedConstructor: ClassConstructor<any> | null;
}
