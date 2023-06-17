import { ErrorBuilder } from './ErrorBuilder';

export const PostConstruct: PropertyDecorator & MethodDecorator = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@PostConstruct');
};
