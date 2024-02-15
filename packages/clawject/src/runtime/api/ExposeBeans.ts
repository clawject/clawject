/** @public */
export const ExposeBeans = <T extends object>(): (exposedBeans: ExposedBeans<T>) => ExposedBeans<T> => {
  return (exportedBeans) => exportedBeans;
};

/** @public */
export interface ExposedBeans<T extends object> {
  readonly beans: T;
  readonly ___clawject_internal_token___: never;
}
