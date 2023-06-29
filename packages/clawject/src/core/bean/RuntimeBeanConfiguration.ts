export interface RuntimeBeanConfiguration {
    beanConfiguration: Record<string, InternalBeanConfig>;
}

export interface InternalBeanConfig {
    scope?: 'prototype' | 'singleton';
    public?: boolean | undefined;
    lazy: boolean;
}
