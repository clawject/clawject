export interface DIConfig {
  mode: 'application' | 'atomic';
  unsafeTSVersion: boolean;
  features: {
    keepContextNames: boolean;
    defaultExternalBeans: boolean;
  }
}
