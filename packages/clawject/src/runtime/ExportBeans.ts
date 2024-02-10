/** @public */
export const ExportBeans = <T extends object>(): Promise<ExportedBeans<T>> => {
  return new Promise(() => {});
};

/** @public */
export interface ExportedBeans<T extends object> {
  readonly beans: T;
  readonly ___clawject_internal_token___: never;
}
