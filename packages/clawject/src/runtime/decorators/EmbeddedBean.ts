import { ErrorBuilder } from '../ErrorBuilder';
import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';

type EmbeddedBeanTarget = PropertyDecorator;
export const EmbeddedBean: DecoratorWithoutArguments<EmbeddedBeanTarget> = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@EmbeddedBean');
};
