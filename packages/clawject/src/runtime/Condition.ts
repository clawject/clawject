/** @public */
export abstract class Condition {
  abstract matches(): boolean;

  cacheable(): boolean {
    return true;
  }

  and(other: Condition): Condition {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const instance = this;

    return new class extends Condition {
      matches(): boolean {
        return instance.matches() && other.matches();
      }

      override cacheable(): boolean {
        return instance.cacheable() && other.cacheable();
      }
    };
  }

  or(other: Condition): Condition {
    const instance = this;

    return new class extends Condition {
      matches(): boolean {
        return instance.matches() || other.matches();
      }

      override cacheable(): boolean {
        return instance.cacheable() || other.cacheable();
      }
    };
  }
}
