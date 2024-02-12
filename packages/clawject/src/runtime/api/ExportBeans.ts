/** @public */
export const ExportBeans = <T extends object>(): (exportedBeans: ExportedBeans<T>) => ExportedBeans<T> => {
  return (exportedBeans) => exportedBeans;
};

/** @public */
export interface ExportedBeans<T extends object> {
  readonly beans: T;
  readonly ___clawject_internal_token___: never;
}
