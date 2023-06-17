import { ErrorBuilder } from './ErrorBuilder';

export const BeforeDestruct: PropertyDecorator & MethodDecorator = (): void => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@BeforeDestruct');
};
