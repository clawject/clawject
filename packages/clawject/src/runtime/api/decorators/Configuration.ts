import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';
import { ErrorBuilder } from '../../ErrorBuilder';
import { ClassConstructor } from '../ClassConstructor';
import { MetadataStorage } from '../../metadata/MetadataStorage';

/** @public */
export type ConfigurationTarget = ClassDecorator;
/** @public */
export const Configuration: {
  copyMetadata: <T>(source: ClassConstructor<T>, target: ClassConstructor<T>) => ClassConstructor<T>;
} & DecoratorWithoutArguments<ConfigurationTarget> = (() => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Configuration');
}) as any;
Configuration.copyMetadata = (source, target) => {
  const applicationMetadata = MetadataStorage.getConfigurationMetadata(source);

  if (applicationMetadata === null) {
    // TODO: runtime error
    throw new Error('No application metadata found on source class');
  }

  MetadataStorage.setConfigurationMetadata(target, applicationMetadata);

  return target;
};
