import { ErrorBuilder } from '../ErrorBuilder';

export type QualifierTarget = PropertyDecorator & MethodDecorator;
export const Qualifier: (value: string) => QualifierTarget = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Qualifier');
};
