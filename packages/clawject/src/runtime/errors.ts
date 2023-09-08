/** @public */
export namespace RuntimeErrors {
  /** @public */
  export class NoInitializedContextFoundError extends Error {
    override name = 'NoInitializedContextFoundError' as const;
  }

  /** @public */
  export class BeanNotFoundError extends Error {
    override name = 'BeanNotFoundError' as const;
  }

  /** @public */
  export class ClassNotInheritorOfCatContextError extends Error {
    override name = 'ClassNotInheritorOfCatContextError' as const;
  }

  /** @public */
  export class UsageWithoutConfiguredDIError extends Error {
    override name = 'UsageWithoutConfiguredDIError' as const;
  }

  /** @public */
  export class IllegalAccessError extends Error {
    override name = 'IllegalAccessError' as const;
  }

  /** @public */
  export class DuplicateScopeError extends Error {
    override name = 'DuplicateScopeError' as const;
  }

  /** @public */
  export class ScopeIsNotRegisteredError extends Error {
    override name = 'ScopeIsNotRegisteredError' as const;
  }

  /** @public */
  export class PrimitiveWrappedInProxyError extends Error {
    override name = 'PrimitiveWrappedInProxyError' as const;
  }
}
