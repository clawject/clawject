import { BeanScope } from '../decorators/Bean';

export interface RuntimeBeanMetadata {
    scope: BeanScope;
    public: boolean;
    lazy: boolean;
}
