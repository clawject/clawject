import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';
import { ErrorBuilder } from '../../ErrorBuilder';
import { ClassConstructor } from '../ClassConstructor';
import { MetadataStorage } from '../../metadata/MetadataStorage';
import { RuntimeErrors } from '../RuntimeErrors';

/** @public */
export type ClawjectApplicationTarget = ClassDecorator;

/** @public */
export const ClawjectApplication: DecoratorWithoutArguments<ClawjectApplicationTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@ClawjectApplication');
};
// ClawjectApplication.copyMetadata = (source, target) => {
//   const applicationMetadata = MetadataStorage.getApplicationMetadata(source);
//
//   if (applicationMetadata === null) {
//     throw new RuntimeErrors.NoClassMetadataFoundError('No application metadata found on source class');
//   }
//
//   MetadataStorage.setApplicationMetadata(target, applicationMetadata);
//
//   return target;
// };
