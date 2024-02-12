/** @public */
export namespace RuntimeErrors {

  /** @public */
  export class BeanNotFoundError extends Error {
    override name = 'BeanNotFoundError' as const;
  }

  /** @public */
  export class CorruptedMetadataError extends Error {
    override name = 'CorruptedMetadataError' as const;
  }

  /** @public */
  export class DuplicateScopeError extends Error {
    override name = 'DuplicateScopeError' as const;
  }

  /** @public */
  export class IllegalAccessError extends Error {
    override name = 'IllegalAccessError' as const;
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
  export class PrimitiveCouldNotBeWrappedInProxyError extends Error {
    override name = 'PrimitiveCouldNotBeWrappedInProxyError' as const;
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
