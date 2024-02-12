import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';
import { ErrorBuilder } from '../../ErrorBuilder';
import { ClassConstructor } from '../ClassConstructor';
import { MetadataStorage } from '../../metadata/MetadataStorage';
import { RuntimeErrors } from '../RuntimeErrors';

/** @public */
export type ConfigurationTarget = ClassDecorator;
/** @public */
export const Configuration: DecoratorWithoutArguments<ConfigurationTarget> = (() => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Configuration');
}) as any;
// Configuration.copyMetadata = (source, target) => {
//   const applicationMetadata = MetadataStorage.getConfigurationMetadata(source);
//
//   if (applicationMetadata === null) {
//     throw new RuntimeErrors.NoClassMetadataFoundError('No configuration metadata found on source class');
//   }
//
//   MetadataStorage.setConfigurationMetadata(target, applicationMetadata);
//
//   return target;
// };
