export interface DIConfig {
  unsafeTSVersion: boolean;
  mode: 'development' | 'production';
  typeSystem: 'nominal' | 'structural';
  beans: {
    defaultExternal: boolean;
  }
  imports: {
    defaultExternal: boolean;
  }
  logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug' | 'verbose';
}
