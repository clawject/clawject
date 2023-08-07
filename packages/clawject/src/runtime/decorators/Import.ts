import { ErrorBuilder } from '../ErrorBuilder';
import { ClassConstructor } from '../ClassConstructor';
import { NotEmptyArray } from '../types/NotEmptyArray';

export type ImportTarget = ClassDecorator;
export const Import: (clasConstructor: ClassConstructor<any> | NotEmptyArray<ClassConstructor<any>>) => ImportTarget = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Import');
};
