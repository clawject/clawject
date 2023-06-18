export interface IDIConfig {
    mode: 'application' | 'atomic';
    unsafeTSVersion: boolean;
    features: {
        advancedTypeInference: boolean;
        keepContextNames: boolean;
    };
}
