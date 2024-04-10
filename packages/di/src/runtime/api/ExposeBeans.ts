/**
 * *ExposeBeans* function allows you to expose beans from the application context,
 * so that they can be accessed from the outside of the {@link ClawjectApplication @ClawjectApplication} class.
 *
 * This function will have an effect only on the root of your application context class
 * (the one annotated with {@link ClawjectApplication @ClawjectApplication}).
 * Clawject will validate the beans that are being exposed
 * and will report an error if the bean is not found in the application context.
 *
 * @docs https://clawject.com/docs/fundamentals/expose-beans
 *
 * @public
 * */
export const ExposeBeans = <T extends object>(): (exposedBeans: ExposedBeans<T>) => ExposedBeans<T> => {
  return (exposedBeans) => exposedBeans;
};

/**
 * Object that is produced by {@link ExposeBeans} function.
 *
 * @public
 * */
export interface ExposedBeans<T extends object> {
  readonly beans: T;
  readonly ___clawject_internal_token___: never;
}
