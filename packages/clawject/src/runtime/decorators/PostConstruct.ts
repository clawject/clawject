import { ErrorBuilder } from '../ErrorBuilder';
import { Decorator } from './Decorator';

export type PostConstructTarget = PropertyDecorator & MethodDecorator;
export const PostConstruct: Decorator<PostConstructTarget> = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@PostConstruct');
};
