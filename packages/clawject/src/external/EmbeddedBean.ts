import { ErrorBuilder } from './ErrorBuilder';

export const EmbeddedBean: PropertyDecorator = (): void => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@EmbeddedBean');
};
