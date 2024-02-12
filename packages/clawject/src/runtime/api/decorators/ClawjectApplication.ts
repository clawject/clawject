import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';
import { ErrorBuilder } from '../../ErrorBuilder';
import { ClassConstructor } from '../ClassConstructor';
import { MetadataStorage } from '../../metadata/MetadataStorage';

/** @public */
export type ClawjectApplicationTarget = ClassDecorator;

/** @public */
export const ClawjectApplication: {
  copyMetadata: <T>(source: ClassConstructor<T>, target: ClassConstructor<T>) => ClassConstructor<T>;
} & DecoratorWithoutArguments<ClawjectApplicationTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@ClawjectApplication');
};
ClawjectApplication.copyMetadata = (source, target) => {
  const applicationMetadata = MetadataStorage.getApplicationMetadata(source);

  if (applicationMetadata === null) {
    // TODO: runtime error
    throw new Error('No application metadata found on source class');
  }

  MetadataStorage.setApplicationMetadata(target, applicationMetadata);

  return target;
};
