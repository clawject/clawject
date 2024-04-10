/**
 * Namespace for runtime errors.
 *
 * Each error class is a subclass of `Error` and has a unique name.
 *
 * @docs https://clawject.com/docs/errors#runtime
 *
 * @public
 */
export namespace RuntimeErrors {

  /** @public */
  export class ExposedBeanNotFoundError extends Error {
    override name = 'ExposedBeanNotFoundError' as const;
  }

  /** @public */
  export class CorruptedMetadataError extends Error {
    override name = 'CorruptedMetadataError' as const;
  }

  /** @public */
  export class IllegalUsageError extends Error {
    override name = 'IllegalUsageError' as const;
  }

  /** @public */
  export class DuplicateScopeError extends Error {
    override name = 'DuplicateScopeError' as const;
  }

  /** @public */
  export class IllegalArgumentError extends Error {
    override name = 'IllegalArgumentError' as const;
  }

  /** @public */
  export class IllegalStateError extends Error {
    override name = 'IllegalStateError' as const;
  }

  /** @public */
  export class NoClassMetadataFoundError extends Error {
    override name = 'NoClassMetadataFoundError' as const;
  }

  /** @public */
  export class CouldNotBeProxiedError extends Error {
    override name = 'CouldNotBeProxiedError' as const;
  }

  /** @public */
  export class ScopeIsNotRegisteredError extends Error {
    override name = 'ScopeIsNotRegisteredError' as const;
  }

  /** @public */
  export class UsageWithoutConfiguredDIError extends Error {
    override name = 'UsageWithoutConfiguredDIError' as const;
  }
}
