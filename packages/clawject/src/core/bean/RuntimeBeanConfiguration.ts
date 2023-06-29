export interface RuntimeBeanConfiguration {
    beanConfiguration: Record<string, Partial<InternalBeanConfig>>
}

export interface InternalBeanConfig {
    scope: 'prototype' | 'singleton';
    public: boolean;
}
