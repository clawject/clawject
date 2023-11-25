export interface IDIConfigFull {
  mode: 'application' | 'atomic';
  unsafeTSVersion: boolean;
  features: {
    advancedClassTypeResolution: boolean;
    keepContextNames: boolean;
  };
}
