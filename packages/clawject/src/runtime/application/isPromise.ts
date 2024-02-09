import { MaybeAsync } from './MaybeAsync';

export const isPromise = <T>(value: MaybeAsync<T>): value is Promise<T> => {
  return value instanceof Promise;
};
