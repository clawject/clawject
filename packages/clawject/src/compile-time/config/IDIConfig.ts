export interface IDIConfig {
    mode: 'application' | 'atomic';
    unsafeTSVersion: boolean;
    features: {
        advancedClassTypeResolution: boolean;
        keepContextNames: boolean;
        lazyBeans: boolean;
    };
}
