import { ErrorBuilder } from '../ErrorBuilder';

/** @public */
export type QualifierTarget = PropertyDecorator & MethodDecorator;
/** @public */
export const Qualifier: (value: string) => QualifierTarget = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Qualifier');
};
