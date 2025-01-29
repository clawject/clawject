import { Symbols } from '../Symbols';

export interface Lazy<T> {
  readonly [Symbols.Lazy]: void;

  (contextId?: unknown): Promise<T>;

  /**
   * It's a getter that returns `true` if the value is ready to be accessed synchronously.
   */
  get ready(): boolean;

  /**
   * It's a getter that returns a value if it's ready to be accessed synchronously.
   *
   * //TODO - define specific error
   * If the value is not ready, it throws an Error
   */
  get value(): T;
}
