import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';
import { ErrorBuilder } from '../ErrorBuilder';
import { ClassConstructor } from '../ClassConstructor';
import { MetadataStorage } from '../metadata/MetadataStorage';

export type ConfigurationTarget = ClassDecorator;
export type ConfigurationCopier = {
  copy<T, A extends any[], C extends ClassConstructor<T, A>>(configurationClass: C): C
}
export const Configuration: DecoratorWithoutArguments<ConfigurationTarget> & ConfigurationCopier = (() => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@Configuration');
}) as any;
Configuration.copy = (configurationClass: ClassConstructor<any>): any => {
  const className = configurationClass.name;

  const {
    className: copiedConfigurationClass
  } = {
    //Trick to inherit class name
    [className]: class extends configurationClass {},
  } as Record<string, any>;

  const metadata = MetadataStorage.getConfigurationMetadata(configurationClass);

  if (!metadata) {
    throw ErrorBuilder.noClassMetadataFoundError(copiedConfigurationClass);
  }

  MetadataStorage.setConfigurationMetadata(copiedConfigurationClass, metadata);

  return copiedConfigurationClass;
};
