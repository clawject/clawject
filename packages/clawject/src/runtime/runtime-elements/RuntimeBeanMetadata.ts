import { ScopeValue } from '../decorators';

export interface RuntimeBeanMetadata {
    scope: ScopeValue;
    public: boolean;
    lazy: boolean | null;
}
