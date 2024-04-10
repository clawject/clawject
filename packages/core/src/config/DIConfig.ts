export interface DIConfig {
  unsafeTSVersion: boolean;
  typeSystem: 'nominal' | 'structural';
  beans: {
    defaultExternal: boolean;
  }
  imports: {
    defaultExternal: boolean;
  }
  logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug' | 'verbose';
}
